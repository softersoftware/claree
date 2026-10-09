import { createServer, type Server } from 'node:http'
import type { Account } from './accounts'

const css = `
body{margin:0;background:#f6f8fa;color:#1f2328;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
main{max-width:340px;margin:40px auto;padding:0 16px}
svg{display:block;margin:0 auto;width:48px;height:48px;fill:#1f2328}
h1{margin:24px 0 16px;text-align:center;font-size:24px;font-weight:300;letter-spacing:-.5px}
h1 small{display:block;font-size:16px;color:#59636e}
.box{background:#fff;border:1px solid #d1d9e0;border-radius:6px;padding:16px;margin-bottom:16px}
label{display:block;font-weight:600}
input{display:block;box-sizing:border-box;width:100%;margin:4px 0 16px;padding:5px 12px;font:inherit;border:1px solid #d1d9e0;border-radius:6px}
button,.button{display:block;box-sizing:border-box;width:100%;padding:5px 16px;font:inherit;font-weight:500;text-align:center;text-decoration:none;border-radius:6px;cursor:pointer}
button{background:#1f883d;color:#fff;border:1px solid #1f232826}
.button{background:#f6f8fa;color:#1f2328;border:1px solid #d1d9e0}
.row{display:flex;gap:8px;margin-top:16px}
a{color:#0969da;text-decoration:none}
ul{margin:8px 0 0;padding:0;list-style:none}
li{margin:4px 0}
.muted{color:#59636e}
.small{font-size:12px}
.rule{border-top:1px solid #d1d9e0;margin-top:12px;padding-top:12px}`

const mark =
  '<svg viewBox="0 0 16 16" aria-label="GitHub"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.37A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>'

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)

const page = (title: string, body: string) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>${css}</style></head><body><main>${mark}${body}</main></body></html>`

const hidden = (fields: Record<string, string>) =>
  Object.entries(fields)
    .map(([name, value]) => `<input type="hidden" name="${escape(name)}" value="${escape(value)}">`)
    .join('')

const signIn = (accounts: readonly Account[], appName: string, callback: string, state: string) =>
  page(
    'Sign in to GitHub',
    `<h1>Sign in to GitHub<small>to continue to ${escape(appName)}</small></h1>
<form class="box" action="/authorize">${hidden({ callback, state })}
<label for="login">Username or email address</label><input id="login" name="login" list="logins" required autofocus autocomplete="off">
<datalist id="logins">${accounts.map(({ login }) => `<option value="${escape(login)}">`).join('')}</datalist>
<label for="password">Password</label><input id="password" type="password" value="mock">
<button type="submit">Sign in</button></form>
<div class="box"><strong>Accounts</strong><ul>${accounts
      .map(
        ({ login, name }) =>
          `<li><a href="/authorize?${escape(new URLSearchParams({ login, callback, state }).toString())}">${escape(login)}</a> <span class="muted">${escape(name)}</span></li>`,
      )
      .join('')}</ul></div>`,
  )

const authorize = (appName: string, login: string, callback: string, state: string) =>
  page(
    `Authorize ${appName}`,
    `<h1>Authorize ${escape(appName)}</h1>
<div class="box"><p><strong>${escape(appName)}</strong> by <a>softersoftware</a> would like permission to:</p>
<ul class="rule"><li>Verify your GitHub identity (${escape(login)})</li><li>Know which resources you can access</li><li>Act on your behalf</li></ul>
<p class="muted small">Read access to code, metadata and pull requests. Read and write access to issues.</p>
<form action="${escape(callback)}" class="row">${hidden({ login, state })}
<a class="button" href="${escape(`${callback}?${new URLSearchParams({ error: 'access_denied', state })}`)}">Cancel</a>
<button type="submit">Authorize ${escape(appName)}</button></form></div>
<p class="muted small" style="text-align:center">Authorizing will redirect to ${escape(new URL(callback).origin)}</p>`,
  )

/** GitHub's sign-in and authorization pages, as the mock imitates them (ADR 0015). */
export const serveGitHubPages = (accounts: readonly Account[], appName: string, port: number): Server =>
  createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const query = Object.fromEntries(url.searchParams)
    const callback = query.callback ?? ''
    const state = query.state ?? ''
    const html =
      !/^https?:\/\//.test(callback)
        ? undefined
        : url.pathname === '/login'
          ? signIn(accounts, appName, callback, state)
          : url.pathname === '/authorize'
            ? authorize(appName, query.login ?? '', callback, state)
            : undefined
    response.writeHead(html === undefined ? 404 : 200, { 'content-type': 'text/html; charset=utf-8' })
    response.end(html ?? page('Not found', '<h1>Not found</h1>'))
  })
    .listen(port, 'localhost')
    .unref()
