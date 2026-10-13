import { createRoute, Link, notFound } from '@tanstack/react-router';
import { nameAndScope } from '@claree/domain';
import { useLanguage } from '@/language';
import { Markdown } from '@/markdown';
import { Card, Empty } from '@/ui';
import { ProjectPage, projectRoute, useContents, useProjectParams } from './project';

/** A domain is opened by the name of its file, without `.md`. */
const domainOf = (file: string) => file.replace(/\.md$/, '');

function Domains() {
  const { strings: t } = useLanguage();
  const params = useProjectParams();
  const { domains } = useContents();
  return (
    <ProjectPage title={t.nav.domains}>
      {domains.length === 0 && <Empty>{t.domains.none}</Empty>}
      {domains.map(({ file, text }) => {
        const { name, scope: description } = nameAndScope(file, text);
        return (
          <Link
            key={file}
            to="/projects/$owner/$repository/domains/$domain"
            params={{ ...params, domain: domainOf(file) }}
            className="block"
          >
            <Card>
              <h2 className="font-serif text-lg font-semibold">{name}</h2>
              {description !== '' && (
                <div className="mt-1 text-muted">
                  <Markdown text={description} linked={(_, children) => <>{children}</>} />
                </div>
              )}
            </Card>
          </Link>
        );
      })}
    </ProjectPage>
  );
}

export const domainsRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'domains',
  component: Domains,
});

function Domain() {
  const { strings: t } = useLanguage();
  const params = domainRoute.useParams();
  const { domains } = useContents();
  const domain = domains.find(({ file }) => domainOf(file) === params.domain);
  if (!domain) throw notFound();
  const files = new Set(domains.map(({ file }) => file));
  return (
    <ProjectPage
      back={
        <Link to="/projects/$owner/$repository/domains" params={params} className="hover:text-ink">
          {t.nav.domains}
        </Link>
      }
    >
      <Markdown
        text={domain.text}
        linked={(href, children) =>
          files.has(href) ? (
            <Link
              to="/projects/$owner/$repository/domains/$domain"
              params={{ ...params, domain: domainOf(href) }}
              className="text-accent underline-offset-2 hover:underline"
            >
              {children}
            </Link>
          ) : undefined
        }
      />
    </ProjectPage>
  );
}

export const domainRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'domains/$domain',
  component: Domain,
});
