import { createRoute } from '@tanstack/react-router';
import { AgreeBy, isDomainExpert } from '@/agreement';
import { useLanguage } from '@/language';
import { useBusiness } from '@/sketch/store';
import { Adding, Button, Card, Empty, External, Form, Input, Note, Pill, Section, Select } from '@/ui';
import { ProjectPage, projectRoute } from './project';

function Prototypes() {
  const { strings: t } = useLanguage();
  const { business, change } = useBusiness();
  const without = business.versions.filter(
    (version) => !version.deployed && !business.prototypes.some((prototype) => prototype.version === version.name),
  );
  return (
    <ProjectPage title={t.steps.prototypes}>
      <Note>{t.prototypes.note}</Note>
      <Section title={t.steps.prototypes}>
        {business.prototypes.length === 0 && <Empty>{t.prototypes.none}</Empty>}
        {[...business.prototypes].reverse().map((prototype) => (
          <Card key={prototype.version} tone={prototype.validation ? 'plain' : 'accent'}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">{t.prototypes.version(prototype.version)}</p>
              <Pill tone={prototype.validation ? 'plain' : 'accent'}>
                {prototype.validation ? t.prototypes.validated : t.prototypes.beingTried}
              </Pill>
            </div>
            <p className="mt-1 text-sm">
              <External href={prototype.where}>{prototype.where}</External>
            </p>
            <div className="mt-3 text-sm">
              {prototype.validation ? (
                <p className="text-muted">
                  {t.prototypes.validatedBy(prototype.validation.by, prototype.validation.on)}
                </p>
              ) : (
                <AgreeBy
                  label={t.prototypes.validate}
                  among={isDomainExpert}
                  onAgree={(agreement) =>
                    change((business) => {
                      const found = business.prototypes.find((other) => other.version === prototype.version);
                      if (found) found.validation = agreement;
                    })
                  }
                />
              )}
            </div>
          </Card>
        ))}
        {without.length > 0 ? (
          <Adding label={t.prototypes.add}>
            <Form
              onSubmit={({ version = '', where = '' }) =>
                change((business) => void business.prototypes.push({ version, where }))
              }
            >
              <div className="flex gap-2">
                <Select
                  name="version"
                  label={t.prototypes.forVersion}
                  options={without.map((version) => [version.name, version.name] as const)}
                />
                <Input name="where" label={t.prototypes.where} />
              </div>
              <Button submit>{t.add}</Button>
            </Form>
          </Adding>
        ) : (
          business.versions.length > 0 && <Empty>{t.prototypes.noVersion}</Empty>
        )}
      </Section>
    </ProjectPage>
  );
}

export const prototypesRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'prototypes',
  component: Prototypes,
});
