import { createRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/language';
import { byDate, today } from '@/sketch/business';
import { newId, useBusiness } from '@/sketch/store';
import { Adding, Button, Card, Empty, Form, Note, Section, Select, Textarea } from '@/ui';
import { ProjectPage, projectRoute, useProjectParams } from './project';

function Feedback() {
  const { strings: t } = useLanguage();
  const params = useProjectParams();
  const { business, change } = useBusiness();
  return (
    <ProjectPage title={t.steps.feedback}>
      <Note>{t.feedback.note}</Note>
      <Section title={t.steps.feedback}>
        {business.feedback.length === 0 && <Empty>{t.feedback.none}</Empty>}
        {byDate(business.feedback).map((feedback) => {
          const workshop = business.workshops.find((workshop) => workshop.id === feedback.workshop);
          return (
            <Card key={feedback.id}>
              <p className="font-serif" lang={business.language}>
                {feedback.text}
              </p>
              <p className="mt-1 text-xs text-muted">
                {feedback.from}, {feedback.date}
              </p>
              <div className="mt-3 text-sm">
                {workshop ? (
                  <Link
                    to="/projects/$owner/$repository/workshops/$workshop"
                    params={{ ...params, workshop: workshop.id }}
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    {t.feedback.workshop(workshop.title)}
                  </Link>
                ) : (
                  <Button
                    quiet
                    onClick={() =>
                      change((business) => {
                        const id = newId();
                        business.workshops.push({ id, date: today(), title: feedback.text, documents: [] });
                        const found = business.feedback.find((other) => other.id === feedback.id);
                        if (found) found.workshop = id;
                      })
                    }
                  >
                    {t.feedback.callWorkshop}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
        {business.participants.length > 0 && (
          <Adding label={t.feedback.add}>
            <Form
              onSubmit={({ from = '', text = '' }) =>
                change((business) => void business.feedback.push({ id: newId(), date: today(), from, text }))
              }
            >
              <Select
                name="from"
                label={t.feedback.from}
                options={business.participants.map((participant) => [participant.name, participant.name] as const)}
              />
              <Textarea name="text" label={t.feedback.text} />
              <Button submit>{t.add}</Button>
            </Form>
          </Adding>
        )}
      </Section>
    </ProjectPage>
  );
}

export const feedbackRoute = createRoute({
  getParentRoute: () => projectRoute,
  path: 'feedback',
  component: Feedback,
});
