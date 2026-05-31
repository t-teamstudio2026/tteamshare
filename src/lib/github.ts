interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

/**
 * Encodes string to UTF-8 Base64 (supporting unicode characters)
 */
function utf8ToBase64(str: string): string {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch {
    // Fallback for environment where btoa is not defined (e.g. Server components)
    return Buffer.from(str, 'utf-8').toString('base64');
  }
}

export async function saveToGitHub(
  config: GitHubConfig,
  filePath: string, // e.g. "public/data/software.json"
  data: unknown,
  commitMessage: string
) {
  const { token, owner, repo, branch } = config;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // 1. Get the current file's SHA to update it
  let sha: string | undefined;
  try {
    const getRes = await fetch(`${url}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }
  } catch (error) {
    console.warn(`Could not get SHA for ${filePath}, attempting to create...`, error);
  }

  // 2. Put the new content
  const jsonString = JSON.stringify(data, null, 2);
  const content = utf8ToBase64(jsonString);

  const payload: {
    message: string;
    content: string;
    branch: string;
    sha?: string;
  } = {
    message: commitMessage,
    content,
    branch,
  };

  if (sha) {
    payload.sha = sha;
  }

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!putRes.ok) {
    const errBody = await putRes.json().catch(() => ({}));
    throw new Error(errBody.message || `GitHub API error: ${putRes.statusText}`);
  }

  return await putRes.json();
}
