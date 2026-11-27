# 0019 — Users give feedback without signing in, and see a project's feedback in public

**Status**: proposed; would amend point 1 of [0014](0014-every-project-opens-signed-in-through-the-github-api.md) and point 4 of [0010](0010-the-platform-acts-through-a-github-app.md)

## Context

The [feedback](../domain/step_9_feedback.md) step asks that anyone using a digital tool can give feedback without saying who they are, and read every feedback with what became of it. The first project to need it is Card Games, a game in the browser whose players have no GitHub account.

Two earlier decisions stand in the way:

- [0014](0014-every-project-opens-signed-in-through-the-github-api.md) opens no project without signing in.
- [0010](0010-the-platform-acts-through-a-github-app.md) has the platform act only in the name of the person signed in, never in its own. A user who gives feedback is signed in nowhere.

What makes it simpler: feedback is conversation, not specification, so [0008](0008-the-business-is-in-files-the-solution-in-github-issues.md) already puts it in issues. And only projects whose owner chooses to open their feedback need any of this.

## Decision

1. **A project opts in** with a `feedback` section in a file of its repository, `.claree/feedback.json`: which kinds of feedback it accepts and where its feedback form may be embedded from (the digital tool's addresses). Without it, nothing below applies to the project.

2. **A feedback is an issue labelled `feedback`** in the project's repository, with `feedback: problem` or `feedback: wish`, and the version it was given from. Its outcome is a label too (`outcome: known`, `outcome: planned`, `outcome: taken`, `outcome: fixed`, `outcome: not-planned`), and the stories that answer it are linked from it.

3. **The platform creates that issue in its own name**, with the installation token of the GitHub App, and only that: amending point 4 of 0010, which still holds for everything a signed-in participant does. The app needs no new permission: `Issues: read and write` is already its own.

4. **The feedback form is a public endpoint**, `POST /api/projects/{owner}/{repo}/feedback`, open to the addresses the project allows. It limits the number of feedbacks per network address and per hour, and refuses text over a set length.

5. **No contact is asked for or kept.** The form answers with the address of the feedback's page, where the user follows it. The platform keeps no database and no personal data, as before.

6. **A project's feedback page is public** when the project opted in: the list of its `feedback` issues and their outcomes, read with the installation token, and the form. Amending point 1 of 0014 for this page only; everything else still opens signed in.

7. **Answers are comments on the feedback's issue**, written by a maker with their own tools, Claude Code among them, as any issue work. The public page shows them.

## Consequences

**Easier.** Users need no account, and no personal data is kept anywhere. A project's feedback lives with its other issues, and survives the platform.

**Easier.** Sorting is ordinary issue work: labels, links, milestones, with any tool.

**Harder.** The platform now writes in its own name, in projects that opted in. Spam lands in a public repository; rate limits and the list of allowed addresses are the first defence, and a maker closing a feedback as spam the second.

**Harder.** A user is told nothing unless they come back to their feedback's page. Answering by e-mail would need a contact, and a later decision.
