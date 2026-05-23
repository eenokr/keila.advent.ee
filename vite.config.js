import { defineConfig } from 'vite';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isProjectPage = repoName && !repoName.endsWith('.github.io');

export const base = process.env.GITHUB_ACTIONS && isProjectPage ? `/${repoName}/` : '/';

export default defineConfig({
	base,
});
