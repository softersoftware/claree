import { createRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { AgreeBy, isDomainExpert } from '@/agreement';
import { useLanguage } from '@/language';
import { type Business, type Domain, type Rule, today } from '@/sketch/business';
import { newId, useBusiness } from '@/sketch/store';
import { Adding, Button, Card, Empty, Form, Input, Note, Pill, Section, Textarea } from '@/ui';
import { ProjectPage, projectRoute, useProjectParams } from './project';

function Domains() {
  const { strings: t } = useLanguage();
  const params = useProjectParams();
  const { business, change } = useBusiness();
  return (
    <ProjectPage title={t.steps.domains}>
      <Note>{t.domains.note}</Note>
      <Section title={t.steps.domains}>
        {business.domains.length === 0 && <Empty>{t.domains.none}</Empty>}
        {business.domains.map((domain) => {
          const proposed = domain.rules.filter((rule) => !rule.agreement).length;
          const open = domain.questions.filter((question) => question.answer === undefined).length;
          return (
            <Link
              key={domain.id}
              to="/projects/$owner/$repository/domains/$domain"
              params={{ ...params, domain: domain.id }}
              className="block"
            >
              <Card>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-serif text-lg font-semibold" lang={business.language}>
                    {domain.name}
                  </p>
                  {proposed > 0 && <Pill tone="warn">{t.overview.rulesToConfirm(proposed)}</Pill>}
                </div>
                <p className="mt-1 font-serif text-muted" lang={business.language}>
                  {domain.description}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {t.domains.counts(domain.glossary.length, domain.rules.length, open)}
                </p>
              </Card>
            </Link>
          );
        })}
        <Adding label={t.domains.add}>
          <Form
            onSubmit={({ name = '', description = '' }) =>
              change(
                (business) =>
                  void business.domains.push({
                    id: newId(),
                    name,
                    description,
                    glossary: [],
                    rules: [],
                    questions: [],
                  }),
              )
            }
          >
            <Input name="name" label={t.domains.name} />
            <Textarea name="description" label={t.domains.description} />
            <Button submit>{t.add}</Button>
          </Form>
        </Adding>
      </Section>
    </ProjectPage>
  );
}

export const domainsRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'domains',
  component: Domains,
});

const inDomain = (business: Business, id: string) => business.domains.find((domain) => domain.id === id) as Domain;

function RuleCard({ domain, rule }: { domain: string; rule: Rule }) {
  const { strings: t } = useLanguage();
  const { business, change } = useBusiness();
  const [rewriting, setRewriting] = useState(false);
  const edit = (apply: (rule: Rule) => void) =>
    change((business) => {
      const found = inDomain(business, domain).rules.find((other) => other.id === rule.id);
      if (found) apply(found);
    });
  return (
    <Card>
      {rewriting ? (
        <Form
          onSubmit={({ text = '' }) => {
            edit((rule) => {
              if (rule.text === text) return;
              rule.text = text;
              delete rule.agreement;
            });
            setRewriting(false);
          }}
        >
          <Textarea name="text" label={t.domains.rule} defaultValue={rule.text} />
          {rule.agreement && <Note>{t.domains.rewriteNote}</Note>}
          <Button submit>{t.save}</Button>
        </Form>
      ) : (
        <>
          <p className="font-serif" lang={business.language}>
            {rule.text}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            {rule.agreement ? (
              <span className="flex items-center gap-2 text-muted">
                <Pill tone="accent">{t.domains.agreed}</Pill>
                {t.agreed(rule.agreement.by, rule.agreement.on)}
              </span>
            ) : (
              <span className="flex flex-wrap items-center gap-2">
                <Pill tone="warn">{t.domains.proposed}</Pill>
                <AgreeBy
                  label={t.domains.confirm}
                  among={isDomainExpert}
                  onAgree={(agreement) => edit((rule) => void (rule.agreement = agreement))}
                />
              </span>
            )}
            <button type="button" onClick={() => setRewriting(true)} className="text-accent hover:underline">
              {t.domains.rewrite}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

function DomainPage() {
  const { strings: t } = useLanguage();
  const params = domainRoute.useParams();
  const { business, change } = useBusiness();
  const domain = business.domains.find((domain) => domain.id === params.domain);
  if (!domain) throw notFound();
  const edit = (apply: (domain: Domain) => void) => change((business) => apply(inDomain(business, domain.id)));
  const open = domain.questions.filter((question) => question.answer === undefined);
  const answered = domain.questions.filter((question) => question.answer !== undefined);

  return (
    <ProjectPage
      title={domain.name}
      back={
        <Link to="/projects/$owner/$repository/domains" params={params} className="hover:text-ink">
          {t.domains.back}
        </Link>
      }
    >
      <p className="-mt-4 font-serif text-lg" lang={business.language}>
        {domain.description}
      </p>

      <Section title={t.domains.glossary}>
        {domain.glossary.length > 0 && (
          <Card>
            <dl className="divide-y divide-rule" lang={business.language}>
              {domain.glossary.map((term) => (
                <div key={term.name} className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="font-semibold">{term.name}</dt>
                  <dd className="font-serif">{term.definition}</dd>
                </div>
              ))}
            </dl>
          </Card>
        )}
        <Adding label={t.domains.addTerm}>
          <Form
            onSubmit={({ name = '', definition = '' }) =>
              edit((domain) => void domain.glossary.push({ name, definition }))
            }
          >
            <Input name="name" label={t.domains.term} />
            <Input name="definition" label={t.domains.definition} />
            <Button submit>{t.add}</Button>
          </Form>
        </Adding>
      </Section>

      <Section title={t.domains.rules}>
        {domain.rules.length === 0 && <Empty>{t.domains.noRules}</Empty>}
        {domain.rules.map((rule) => (
          <RuleCard key={rule.id} domain={domain.id} rule={rule} />
        ))}
        <Adding label={t.domains.addRule}>
          <Form onSubmit={({ text = '' }) => edit((domain) => void domain.rules.push({ id: newId(), text }))}>
            <Textarea name="text" label={t.domains.rule} />
            <Button submit>{t.add}</Button>
          </Form>
        </Adding>
      </Section>

      <Section title={t.domains.questions}>
        {open.length === 0 && <Empty>{t.domains.noQuestions}</Empty>}
        {open.map((question) => (
          <Card key={question.id}>
            <p className="font-serif" lang={business.language}>
              {question.text}
            </p>
            <p className="mt-1 text-xs text-muted">{t.domains.asked(question.asked)}</p>
            <div className="mt-3">
              <Form
                onSubmit={({ answer = '' }) =>
                  edit((domain) => {
                    const found = domain.questions.find((other) => other.id === question.id);
                    if (found) found.answer = answer;
                  })
                }
              >
                <div className="flex gap-2">
                  <Input name="answer" label={t.domains.answer} />
                  <Button submit quiet>
                    {t.save}
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        ))}
        <Adding label={t.domains.ask}>
          <Form
            onSubmit={({ text = '' }) =>
              edit((domain) => void domain.questions.push({ id: newId(), text, asked: today() }))
            }
          >
            <Input name="text" label={t.domains.question} />
            <Button submit>{t.add}</Button>
          </Form>
        </Adding>
        {answered.length > 0 && (
          <details>
            <summary className="cursor-pointer text-sm text-muted">
              {t.domains.answered} — {answered.length}
            </summary>
            <ul className="mt-2 space-y-2" lang={business.language}>
              {answered.map((question) => (
                <li key={question.id} className="text-sm">
                  <p className="font-serif">{question.text}</p>
                  <p className="font-serif text-muted">{question.answer}</p>
                </li>
              ))}
            </ul>
          </details>
        )}
      </Section>
    </ProjectPage>
  );
}

export const domainRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'domains/$domain',
  component: DomainPage,
});
