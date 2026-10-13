import { createRoute } from '@tanstack/react-router';
import { useLanguage } from '@/language';
import { Markdown } from '@/markdown';
import { Card, Empty, External, Section } from '@/ui';
import { ProjectPage, projectRoute, useContents } from './project';

function Branding() {
  const { strings: t } = useLanguage();
  const { branding } = useContents();
  if (!branding)
    return (
      <ProjectPage title={t.nav.branding}>
        <Empty>{t.branding.none}</Empty>
      </ProjectPage>
    );
  return (
    <ProjectPage title={t.nav.branding}>
      {branding.files.map(({ file, text }) => (
        <Card key={file}>
          <Markdown text={text} />
        </Card>
      ))}

      {branding.logo && (
        <Section title={t.branding.logo}>
          <Card>
            <img src={branding.logo} alt={t.branding.logo} className="h-12" />
          </Card>
        </Section>
      )}

      {branding.typefaces.length > 0 && (
        <Section title={t.branding.typography}>
          {branding.typefaces.map((typeface) => (
            <Card key={typeface.name}>
              <p className="text-2xl" style={{ fontFamily: typeface.name }}>
                {typeface.name}
              </p>
              <p className="mt-1" style={{ fontFamily: typeface.name }}>
                {t.branding.sample}
              </p>
              <p className="mt-2 text-xs text-muted">{t.branding.typefaceFor(typeface.for)}</p>
            </Card>
          ))}
        </Section>
      )}

      {branding.colours.length > 0 && (
        <Section title={t.branding.colours}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {branding.colours.map((colour) => (
              <div key={colour.name} className="text-sm">
                <div className="h-12 rounded-md border border-rule" style={{ background: colour.value }} />
                <p className="mt-1 font-medium">{colour.name}</p>
                <p className="text-muted">
                  {colour.value} · {colour.for}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {branding.others.length > 0 && (
        <Section title={t.branding.files}>
          <ul className="space-y-1 text-sm">
            {branding.others.map((other) => (
              <li key={other.file}>
                <External href={other.link}>{other.file}</External>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </ProjectPage>
  );
}

export const brandingRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'branding',
  component: Branding,
});
