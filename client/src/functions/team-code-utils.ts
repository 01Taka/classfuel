export const generateTeamCodeUrl = (code: string) => {
  const baseUrl = import.meta.env.VITE_BASE_URL
  return `${baseUrl}/join-team/${code}`
}

export const extractTeamCode = (input: string): string => {
  try {
    const url = new URL(input)
    const match = url.pathname.match(/\/join-team\/([^/]+)/)
    return match ? match[1] : input
  } catch {
    return input
  }
}

export const isRogueFirestoreId = (id: string): boolean =>
  /[\/\\.#$\[\]]/.test(id)
