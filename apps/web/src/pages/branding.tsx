import { createRoute } from '@tanstack/react-router';
import { AgreeBy, isProjectOwner } from '@/agreement';
import { useLanguage } from '@/language';
import { useBusiness } from '@/sketch/store';
import { Adding, Button, Card, Empty, External, Form, Input, Note, Pill, Section } from '@/ui';
import { ProjectPage, projectRoute } from './project';

function Branding() {
  const { strings: t } = useLanguage();
  const { business, change } = useBusiness();
  const branding = business.branding;
  const written = (text: string | undefined) =>
    text ? <p lang={business.language}>{text}</p> : <Empty>{t.branding.notWritten}</Empty>;

  return (
    <ProjectPage title={t.nav.branding}>
      <Note>{t.branding.note}</Note>

      <Section title={t.branding.personality}>
        {branding.personality.length === 0 ? (
          <Empty>{t.branding.noPersonality}</Empty>
        ) : (
          <p className="font-serif text-xl" lang={business.language}>
            {branding.personality.join(' · ')}
          </p>
        )}
        <Adding label={t.branding.addWord}>
          <Form onSubmit={({ word = '' }) => change((business) => void business.branding.personality.push(word))}>
            <div className="flex gap-2">
              <Input name="word" label={t.branding.word} />
              <Button submit>{t.add}</Button>
            </div>
          </Form>
        </Adding>
      </Section>

      <div className="grid gap-8 sm:grid-cols-3">
        <Section title={t.branding.name}>{written(branding.name)}</Section>
        <Section title={t.branding.tagline}>{written(branding.tagline)}</Section>
        <Section title={t.branding.tone}>{written(branding.tone)}</Section>
      </div>

      <Section title={t.branding.directions}>
        {branding.personality.length === 0 ? (
          <Empty>{t.branding.personalityFirst}</Empty>
        ) : branding.directions.length === 0 ? (
          <Empty>{t.branding.noDirections}</Empty>
        ) : (
          <>
            {branding.directions.length === 1 && <p className="text-sm text-warn">{t.branding.oneDirection}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              {branding.directions.map((direction) => (
                <Card key={direction.number} tone={branding.chosen === direction.number ? 'accent' : 'plain'}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-medium">
                      {t.branding.direction} {direction.number} — {direction.name}
                    </p>
                    {branding.chosen === direction.number && <Pill tone="accent">{t.branding.chosen}</Pill>}
                  </div>
                  <p className="mt-1 text-sm">
                    <External href={direction.where}>{direction.where}</External>
                  </p>
                  {branding.chosen !== direction.number && (
                    <div className="mt-3">
                      <Button
                        quiet
                        onClick={() =>
                          change((business) => {
                            business.branding.chosen = direction.number;
                            delete business.branding.agreement;
                          })
                        }
                      >
                        {t.branding.choose}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
        {branding.personality.length > 0 && (
          <Adding label={t.branding.addDirection}>
            <Form
              onSubmit={({ name = '', where = '' }) =>
                change((business) => {
                  const number = String(business.branding.directions.length + 1).padStart(3, '0');
                  business.branding.directions.push({ number, name, where });
                })
              }
            >
              <Input name="name" label={t.branding.name} />
              <Input name="where" label={t.branding.where} />
              <Button submit>{t.add}</Button>
            </Form>
          </Adding>
        )}
      </Section>

      {branding.colours.length > 0 && (
        <Section title={t.branding.colours}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {branding.colours.map((colour) => (
              <div key={colour.name} className="text-sm">
                <div className="h-12 rounded-md border border-rule" style={{ background: colour.value }} />
                <p className="mt-1 font-medium">{colour.name}</p>
                <p className="text-muted">
                  {colour.value} · <span lang={business.language}>{colour.for}</span>
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {branding.typography && <Section title={t.branding.typography}>{written(branding.typography)}</Section>}

      <Section title={t.branding.agreement}>
        {branding.agreement ? (
          <p className="text-sm">{t.branding.agreedBy(branding.agreement.by, branding.agreement.on)}</p>
        ) : (
          <>
            <Empty>{t.branding.notAgreed}</Empty>
            {branding.chosen ? (
              <AgreeBy
                label={t.branding.agree}
                among={isProjectOwner}
                onAgree={(agreement) => change((business) => void (business.branding.agreement = agreement))}
              />
            ) : (
              <Empty>{t.branding.needsChoice}</Empty>
            )}
          </>
        )}
      </Section>
    </ProjectPage>
  );
}

export const brandingRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'branding',
  component: Branding,
});
