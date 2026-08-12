const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    { ignores: ['dist/**'] },
    {
        files: ['src/**/*.ts'],
        extends: tseslint.configs.recommended,
    }
);
