import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LessonKnowledgeCheck } from '../components/learning/LessonKnowledgeCheck';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import {
  ACADEMY_MODULES,
  ACADEMY_PATHS,
  ALL_SYLLABUS_LESSONS,
  getAssessmentQuestionsForLevel,
  getModuleById,
  getModulesForPath,
  getPathById,
  getTopicByCode,
  getTopicsForPath,
} from '../data/academyRoadmap';
import { getLessonBySlug } from '../data/curriculum';
import { GLOSSARY_TERMS } from '../data/glossaryTerms';
import { AcademyTopicPage } from '../pages/AcademyTopicPage';
import { EvaluationPage } from '../pages/EvaluationPage';
import { GlossaryFlashcardsPage } from '../pages/GlossaryFlashcardsPage';
import {
  isFreeBrowseEnabled,
  isTopicUnlocked,
  listLevelAssessments,
  listTopicProgress,
  saveTopicProgress,
  setFreeBrowseEnabled,
  submitLevelAssessment,
} from '../services/academyProgressService';
import type { MasteryLevel, TopicProgressRecord } from '../types/curriculum-tree';

const LEVELS: readonly MasteryLevel[] = [1, 2, 3, 4, 5];

describe('Master Academy — Decoupled Syllabus Integrity', () => {
  it('exposes exactly 34 modules and 358 syllabus lessons with zero duplicate ids, codes, or slugs', () => {
    expect(ACADEMY_MODULES).toHaveLength(34);
    expect(ALL_SYLLABUS_LESSONS).toHaveLength(358);

    const moduleIds = new Set(ACADEMY_MODULES.map((mod) => mod.id));
    const moduleCodes = new Set(ACADEMY_MODULES.map((mod) => mod.code));
    expect(moduleIds.size).toBe(34);
    expect(moduleCodes.size).toBe(34);

    const lessonIds = new Set(ALL_SYLLABUS_LESSONS.map((lesson) => lesson.id));
    const lessonCodes = new Set(ALL_SYLLABUS_LESSONS.map((lesson) => lesson.code));
    const lessonSlugs = new Set(ALL_SYLLABUS_LESSONS.map((lesson) => lesson.slug));

    expect(lessonIds.size).toBe(358);
    expect(lessonCodes.size).toBe(358);
    expect(lessonSlugs.size).toBe(358);

    // Every module lessonCode resolves and sums to 358 total lessons
    const totalModuleLessons = ACADEMY_MODULES.reduce(
      (sum, mod) => sum + mod.lessonCodes.length,
      0,
    );
    expect(totalModuleLessons).toBe(358);
  });

  it('matches exact topic counts across all 8 paths and marks optional tracks cleanly', () => {
    expect(ACADEMY_PATHS).toHaveLength(8);

    expect(getTopicsForPath('master_foundations')).toHaveLength(62);
    expect(getTopicsForPath('advanced_price_action')).toHaveLength(33);
    expect(getTopicsForPath('forex')).toHaveLength(52);
    expect(getTopicsForPath('indices')).toHaveLength(50);
    expect(getTopicsForPath('stocks')).toHaveLength(64);
    expect(getTopicsForPath('crypto')).toHaveLength(66);
    expect(getTopicsForPath('strategy_pro')).toHaveLength(25);
    expect(getTopicsForPath('philippines_pse')).toHaveLength(6);

    const stocksModules = getModulesForPath('stocks');
    const stocksS6 = stocksModules.find((mod) => mod.code === 'S6');
    expect(stocksS6).toBeDefined();
    expect(stocksS6?.optional).toBe(true);

    const phPath = getPathById('philippines_pse');
    const phModule = getModuleById('mod-ph1');
    expect(phPath?.optional).toBe(true);
    expect(phModule?.optional).toBe(true);
  });

  it('resolves all prerequisiteCodes and linkedDeepLessonSlug links cleanly and preserves required disclaimers & domain accuracy', () => {
    for (const topic of ALL_SYLLABUS_LESSONS) {
      for (const prereqCode of topic.prerequisiteCodes) {
        expect(
          getTopicByCode(prereqCode),
          `Missing prerequisite ${prereqCode} referenced by ${topic.code}`,
        ).toBeDefined();
      }

      if (topic.linkedDeepLessonSlug) {
        expect(
          getLessonBySlug(topic.linkedDeepLessonSlug),
          `Missing deep lesson ${topic.linkedDeepLessonSlug} referenced by ${topic.code}`,
        ).toBeDefined();
      }
    }

    // SMC & Market Structure modules must carry analytical-framework disclaimers
    const smcModules = getModulesForPath('advanced_price_action');
    expect(smcModules).toHaveLength(3);
    for (const mod of smcModules) {
      expect(mod.disclaimer).toBeTruthy();
      expect(mod.disclaimer?.toLowerCase()).toContain('analytical framework');
    }

    // Indices I1.9 explicitly distinguishes Futures, CFDs, and ETFs
    const i19 = getTopicByCode('I1.9');
    expect(i19).toBeDefined();
    const i19Text = `${i19?.title} ${i19?.overviewEn} ${i19?.keyPoints.join(' ')}`.toLowerCase();
    expect(i19Text).toContain('futures');
    expect(i19Text).toContain('cfds');
    expect(i19Text).toContain('etfs');
    expect(i19?.overviewEn.toLowerCase()).toContain('not the same instrument');

    // PH1.1–PH1.6 cover PSE, BSP, and SEC
    const phCodes = ['PH1.1', 'PH1.2', 'PH1.3', 'PH1.4', 'PH1.5', 'PH1.6'] as const;
    const phCorpus = phCodes
      .map((code) => {
        const topic = getTopicByCode(code);
        expect(topic, `Missing PH topic ${code}`).toBeDefined();
        return `${topic?.title} ${topic?.overviewEn} ${topic?.keyPoints.join(' ')}`;
      })
      .join(' ');
    expect(phCorpus).toContain('PSE');
    expect(phCorpus).toContain('BSP');
    expect(phCorpus).toContain('SEC');
  });

  it('returns 10 valid 4-option assessment questions for every mastery level (1–5)', () => {
    for (const level of LEVELS) {
      const questions = getAssessmentQuestionsForLevel(level);
      expect(questions).toHaveLength(10);

      for (const item of questions) {
        expect(item.topicCode.trim().length).toBeGreaterThan(0);
        expect(item.topicTitle.trim().length).toBeGreaterThan(0);
        expect(item.quiz.prompt.trim().length).toBeGreaterThan(0);
        expect(item.quiz.options).toHaveLength(4);
        for (const option of item.quiz.options) {
          expect(option.trim().length).toBeGreaterThan(0);
        }
        expect([0, 1, 2, 3]).toContain(item.quiz.correctIndex);
        expect(item.quiz.rationale.trim().length).toBeGreaterThan(0);
        expect(item.quiz.commonTrap.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe('Master Academy — Progression & Assessment Service', () => {
  it('locks topic 8.1 in Guided Mode when prerequisites are unmet and unlocks once completed or in Free Browse', () => {
    const topic81 = getTopicByCode('8.1');
    expect(topic81).toBeDefined();
    expect(topic81!.prerequisiteCodes.length).toBeGreaterThan(0);

    const lockedStatus = isTopicUnlocked(topic81!, {}, false);
    expect(lockedStatus.unlocked).toBe(false);
    expect(lockedStatus.missingPrerequisiteCodes).toEqual(topic81!.prerequisiteCodes);

    // Free Browse bypasses lock even with empty progress
    const freeBrowseStatus = isTopicUnlocked(topic81!, {}, true);
    expect(freeBrowseStatus.unlocked).toBe(true);

    // Completing all prerequisites unlocks in Guided Mode
    const progressMap: Record<string, TopicProgressRecord> = {};
    for (const prereqCode of topic81!.prerequisiteCodes) {
      progressMap[prereqCode] = {
        topicCode: prereqCode,
        readingCompleted: true,
        quizPassed: true,
        quizScorePct: 100,
        practicalCompleted: false,
        completed: true,
        updatedAt: new Date().toISOString(),
      };
    }

    const completedStatus = isTopicUnlocked(topic81!, progressMap, false);
    expect(completedStatus.unlocked).toBe(true);
    expect(completedStatus.missingPrerequisiteCodes).toEqual([]);
  });

  it('auto-sets completed = true in saveTopicProgress once both readingCompleted and quizPassed are true', async () => {
    const afterReading = await saveTopicProgress('1.1', { readingCompleted: true });
    expect(afterReading.readingCompleted).toBe(true);
    expect(afterReading.quizPassed).toBe(false);
    expect(afterReading.completed).toBe(false);

    const afterQuiz = await saveTopicProgress('1.1', { quizPassed: true, quizScorePct: 100 });
    expect(afterQuiz.readingCompleted).toBe(true);
    expect(afterQuiz.quizPassed).toBe(true);
    expect(afterQuiz.quizScorePct).toBe(100);
    expect(afterQuiz.completed).toBe(true);

    const stored = await listTopicProgress();
    expect(stored.find((rec) => rec.topicCode === '1.1')?.completed).toBe(true);
  });

  it('grades level assessments cleanly: fails below 70% with null certificate, passes at >= 70% with formatted code', async () => {
    const failed = await submitLevelAssessment(1, 6, 10);
    expect(failed.level).toBe(1);
    expect(failed.scorePct).toBe(60);
    expect(failed.passed).toBe(false);
    expect(failed.certificateCode).toBeNull();

    const passed = await submitLevelAssessment(1, 7, 10);
    expect(passed.level).toBe(1);
    expect(passed.scorePct).toBe(70);
    expect(passed.passed).toBe(true);
    expect(passed.certificateCode).toMatch(/^TL-L1-\d{4}-[A-Z0-9]{4}$/);

    const list = await listLevelAssessments();
    expect(list).toHaveLength(1);
    expect(list[0].certificateCode).toBe(passed.certificateCode);
  });
});

describe('Master Academy — UI Component Integration', () => {
  it('LessonKnowledgeCheck shows rationale, common trap, and Try Again on wrong answer; Passed badge + callback on right answer', async () => {
    const user = userEvent.setup();
    const topic81 = getTopicByCode('8.1')!;
    const wrongIndex = (topic81.quiz.correctIndex + 1) % 4;
    const onResult = vi.fn();

    render(
      <LanguageProvider>
        <LessonKnowledgeCheck question={topic81.quiz} onResult={onResult} />
      </LanguageProvider>,
    );

    const optionsGroup = screen.getByRole('group', { name: /quiz answer options/i });
    const optionButtons = within(optionsGroup).getAllByRole('button');
    expect(optionButtons).toHaveLength(4);

    // Pick wrong answer
    await user.click(optionButtons[wrongIndex]);
    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(onResult).toHaveBeenCalledWith(false, 0);
    expect(screen.getByText(/testable analytical framework keeps expectations grounded/i)).toBeInTheDocument();
    expect(screen.getByText(/Common Trap:/i)).toBeInTheDocument();
    expect(screen.getByText(/guaranteed algorithmic price targets/i)).toBeInTheDocument();

    // Retry with correct answer
    await user.click(screen.getByRole('button', { name: /try again/i }));
    const retryButtons = within(
      screen.getByRole('group', { name: /quiz answer options/i }),
    ).getAllByRole('button');
    await user.click(retryButtons[topic81.quiz.correctIndex]);
    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(onResult).toHaveBeenLastCalledWith(true, 100);
    expect(screen.getByText(/Passed · 100%/i)).toBeInTheDocument();
  });

  it('AcademyTopicPage renders locked prerequisite banner on 8.1 with Unlock Free Browse, disclaimer, and all 6 sections', async () => {
    const user = userEvent.setup();
    const topic81 = getTopicByCode('8.1')!;
    setFreeBrowseEnabled(false);

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[`/academy/topic/${topic81.slug}`]}>
          <Routes>
            <Route path="/academy/topic/:slug" element={<AcademyTopicPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    // Locked prerequisite banner & Unlock Free Browse button
    expect(
      screen.getByText(/Prerequisite Recommended \(Guided Progression\)/i),
    ).toBeInTheDocument();
    const unlockButton = screen.getByRole('button', { name: /Unlock Free Browse/i });
    expect(unlockButton).toBeInTheDocument();

    // Analytical framework disclaimer
    expect(screen.getByText(/Analytical & Risk Note:/i)).toBeInTheDocument();
    expect(screen.getByText(/strictly an analytical framework/i)).toBeInTheDocument();

    // All 6 structured sections
    expect(screen.getByRole('heading', { name: /Lesson Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Learning Objectives/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Lesson Content & Visual Blueprint/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Practical Examples/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Knowledge Check/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Lesson Completion & Next Topic/i }),
    ).toBeInTheDocument();

    // Unlocking Free Browse removes prerequisite banner
    await user.click(unlockButton);
    expect(isFreeBrowseEnabled()).toBe(true);
    expect(
      screen.queryByText(/Prerequisite Recommended \(Guided Progression\)/i),
    ).not.toBeInTheDocument();
  });

  it('GlossaryFlashcardsPage renders 100 terms, filters to Philippines (PSE), flips flashcard, and increments mastered on Know It', async () => {
    const user = userEvent.setup();
    expect(GLOSSARY_TERMS).toHaveLength(100);
    const expectedPhCount = GLOSSARY_TERMS.filter(
      (entry) => entry.category === 'philippines',
    ).length;
    expect(expectedPhCount).toBeGreaterThan(0);

    render(
      <LanguageProvider>
        <MemoryRouter>
          <GlossaryFlashcardsPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    // Initial 100 terms rendered
    expect(screen.getByText(/100 \/ 100 terms/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Glossary \(100\)/i })).toBeInTheDocument();

    // Filter to Philippines (PSE)
    await user.click(screen.getByRole('button', { name: /Philippines \(PSE\)/i }));
    expect(
      screen.getByText(new RegExp(`${expectedPhCount} / 100 terms`, 'i')),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /PSEi/i })).toBeInTheDocument();

    // Switch to Flashcards mode
    await user.click(screen.getByRole('tab', { name: /^Flashcards$/i }));
    expect(screen.getByText(/Front • Term/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`0 / ${expectedPhCount} mastered`, 'i'))).toBeInTheDocument();

    // Flip the active flashcard
    const flipButton = screen.getByRole('button', { name: /Flashcard front for/i });
    await user.click(flipButton);
    expect(screen.getByText(/Back • Answer/i)).toBeInTheDocument();

    // Mark "Know It" and verify mastered counter increments
    await user.click(screen.getByRole('button', { name: /Know It/i }));
    expect(screen.getByText(new RegExp(`1 / ${expectedPhCount} mastered`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/1 mastered/i)).toBeInTheDocument();
  });

  it('EvaluationPage renders Level 1–5 assessments, completes Level 1 exam with 10/10, and shows SVG Completion Certificate + Download button', async () => {
    const user = userEvent.setup();
    const level1Questions = getAssessmentQuestionsForLevel(1);
    expect(level1Questions).toHaveLength(10);

    render(
      <AuthProvider>
        <LanguageProvider>
          <MemoryRouter>
            <EvaluationPage />
          </MemoryRouter>
        </LanguageProvider>
      </AuthProvider>,
    );

    // Verify all 5 mastery assessment cards render
    expect(screen.getByRole('heading', { name: /Level 1: Beginner/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Level 2: Elementary/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Level 3: Intermediate/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Level 4: Advanced/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Level 5: Professional/i })).toBeInTheDocument();

    // Start Level 1 assessment
    const takeButtons = screen.getAllByRole('button', { name: /Take Assessment/i });
    expect(takeButtons).toHaveLength(5);
    await user.click(takeButtons[0]);

    const runner = screen.getByLabelText(/Level 1 Assessment Runner/i);

    for (let idx = 0; idx < level1Questions.length; idx += 1) {
      const q = level1Questions[idx];
      expect(within(runner).getByText(q.quiz.prompt)).toBeInTheDocument();

      const correctOptionText = q.quiz.options[q.quiz.correctIndex];
      const optionButton = within(runner)
        .getAllByRole('button')
        .find((btn) => btn.textContent?.includes(correctOptionText));
      expect(optionButton, `Could not find correct option for Q${idx + 1}`).toBeDefined();

      await user.click(optionButton!);
      await user.click(within(runner).getByRole('button', { name: /Submit Answer/i }));

      if (idx < level1Questions.length - 1) {
        await user.click(within(runner).getByRole('button', { name: /^Next$/i }));
      } else {
        await user.click(within(runner).getByRole('button', { name: /Finish & View Score/i }));
      }
    }

    // Wait for completion state & earned SVG certificate + Download button
    await waitFor(() => {
      expect(
        screen.getByText(/Assessment Passed • Certificate Unlocked/i),
      ).toBeInTheDocument();
    });

    const certSvg = screen.getByRole('img', {
      name: /TradeLab Academy Level 1 Completion Certificate/i,
    });
    expect(certSvg).toBeInTheDocument();
    expect(certSvg.textContent).toMatch(/TL-L1-\d{4}-[A-Z0-9]{4}/);

    const downloadButtons = screen.getAllByRole('button', {
      name: /Download SVG Certificate/i,
    });
    expect(downloadButtons.length).toBeGreaterThanOrEqual(1);
  }, 15000);
});
