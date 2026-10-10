import { createRoute, Link, notFound } from '@tanstack/react-router';
import { isOpen, openQuestions, questionsOf, rulesOf, termsOf } from '@claree/domain';
import { addDomain, agreeRule, answer, askQuestion, defineTerm, restateRule, writeRule } from '@/actions';
import { useDictionaryIn } from '@/locale';
import { open } from '@/projects';
import { backLink, Button, Card, Empty, Input, Page, Pill, Section } from '@/ui';
import { projectRoute } from './project';

function DomainsPage() {
  const { project, writable } = domainsRoute.useLoaderData();
  const { t } = useDictionaryIn(project.language);
  const { business } = project;

  return (
    <Page title={t.formal.title}>
      <Section title={t.formal.domains(business.domains.length)}>
        {business.domains.length === 0 && <Empty>{t.formal.notCut}</Empty>}
        {business.domains.map((domain) => {
          const terms = termsOf(domain, business.terms);
          const rules = rulesOf(domain, business.rules);
          const agreed = rules.filter((rule) => rule.state === 'agreed').length;
          const stillOpen = openQuestions(questionsOf(domain, business.questions)).length;
          return (
            <Card key={domain.id}>
              <div className="flex items-start justify-between gap-3">
                <Link
                  to="/projects/$projectId/business/domains/$domainId"
                  params={{ projectId: project.id, domainId: domain.id }}
                  className="text-sm font-medium hover:text-accent"
                  lang={project.language}
                >
                  {domain.name}
                </Link>
                <Pill tone={rules.length > 0 && agreed === rules.length ? 'accent' : 'plain'}>
                  {t.formal.agreedOf(agreed, rules.length)}
                </Pill>
              </div>
              <p className="mt-2 text-sm text-muted" lang={project.language}>
                {domain.description}
              </p>
              <p className="mt-2 text-sm text-muted">{t.formal.counts(terms.length, rules.length, stillOpen)}</p>
            </Card>
          );
        })}
        {writable && (
          <Card>
            <form action={addDomain} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.formal.domainName} />
              <Input name="description" placeholder={t.formal.domainDescription} />
              <div>
                <Button quiet>{t.formal.addDomain}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  );
}

export const domainsRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'business/domains',
  loader: ({ params }) => open(params.projectId),
  component: DomainsPage,
});

function DomainPage() {
  const { project, writable, domain } = domainRoute.useLoaderData();
  const { t } = useDictionaryIn(project.language);
  const { business } = project;

  const terms = termsOf(domain, business.terms);
  const rules = rulesOf(domain, business.rules);
  const agreed = rules.filter((rule) => rule.state === 'agreed').length;
  const questions = questionsOf(domain, business.questions);
  const stillOpen = openQuestions(questions);
  const answered = questions.filter((question) => !isOpen(question));

  return (
    <Page
      title={domain.name}
      back={
        <Link className={backLink} to="/projects/$projectId/business/domains" params={{ projectId: project.id }}>
          ← {t.formal.title}
        </Link>
      }
    >
      <Section title={t.formal.whatThisPartIs}>
        <Card>
          <p className="text-sm" lang={project.language}>
            {domain.description}
          </p>
        </Card>
      </Section>

      <Section title={t.formal.lexicon(terms.length)}>
        {terms.length === 0 && <Empty>{t.formal.noTerm}</Empty>}
        {terms.map((term) => (
          <Card key={term.name}>
            <div lang={project.language}>
              <p className="text-sm font-medium">{term.name}</p>
              <p className="mt-1 text-sm text-muted">{term.definition}</p>
            </div>
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={defineTerm} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="domainId" value={domain.id} />
              <Input name="name" placeholder={t.formal.termName} />
              <Input name="definition" placeholder={t.formal.termDefinition} />
              <div>
                <Button quiet>{t.formal.define}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>

      <Section title={t.formal.description(agreed, rules.length)}>
        {rules.length === 0 && <Empty>{t.formal.noRule}</Empty>}
        {rules.map((rule) => (
          <Card key={rule.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm" lang={project.language}>
                {rule.statement}
              </p>
              <Pill tone={rule.state === 'agreed' ? 'accent' : 'warn'}>{t.ruleStates[rule.state]}</Pill>
            </div>
            {writable && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                {rule.state === 'proposed' && (
                  <form action={agreeRule}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="id" value={rule.id} />
                    <Button>{t.formal.agree}</Button>
                  </form>
                )}
                <form action={restateRule} className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="id" value={rule.id} />
                  <Input name="statement" placeholder={t.formal.rewriteIt} defaultValue={rule.statement} />
                  <Button quiet>{t.formal.rewrite}</Button>
                </form>
              </div>
            )}
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={writeRule} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="domainId" value={domain.id} />
              <Input name="statement" placeholder={t.formal.ruleStatement} />
              <Button quiet>{t.formal.writeItDown}</Button>
            </form>
          </Card>
        )}
      </Section>

      <Section title={t.formal.openQuestions(stillOpen.length)}>
        {stillOpen.length === 0 && <Empty>{t.formal.nothingOpen}</Empty>}
        {stillOpen.map((question) => (
          <Card key={question.id}>
            <p className="text-sm" lang={project.language}>
              {question.asked}
            </p>
            {writable && (
              <form action={answer} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="id" value={question.id} />
                <Input name="answer" placeholder={t.formal.whatWasDecided} />
                <Button quiet>{t.formal.answer}</Button>
              </form>
            )}
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={askQuestion} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="domainId" value={domain.id} />
              <Input name="asked" placeholder={t.formal.whatNobodyKnows} />
              <Button>{t.formal.ask}</Button>
            </form>
          </Card>
        )}
      </Section>

      {answered.length > 0 && (
        <Section title={t.formal.answered}>
          {answered.map((question) => (
            <Card key={question.id}>
              <p className="text-sm text-muted" lang={project.language}>
                {question.asked}
              </p>
              <p className="mt-1 text-sm" lang={project.language}>
                {question.answer}
              </p>
            </Card>
          ))}
        </Section>
      )}
    </Page>
  );
}

export const domainRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'business/domains/$domainId',
  loader: async ({ params }) => {
    const opened = await open(params.projectId);
    const domain = opened.project.business.domains.find((one) => one.id === params.domainId);
    if (!domain) throw notFound();
    return { ...opened, domain };
  },
  component: DomainPage,
});
