export function getLastIdx(session, perSession, total) {
  const lastItems = (session + 1) * perSession;
  const lastIdx = lastItems < total ? lastItems : total;
  return lastIdx;
}
