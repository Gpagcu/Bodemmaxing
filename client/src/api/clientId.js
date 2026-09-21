// A lightweight per-browser id, used to scope "my" quests and history when
// talking to the real API. Not real auth — good enough for this project's
// scope. Sent as a header on every request; the mock API ignores it entirely
// since it's already scoped to this browser via localStorage.
const KEY = 'final-project:client-id'

export function getClientId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}