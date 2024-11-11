const fs = require('fs');
const path = require('path');

// Получаем аргументы командной строки
const section = process.argv[2] || 'all'; // 'frontend', 'backend', или 'all'
const ignoreStyles = process.argv.includes('--ignore-styles');
const additionalIgnoreDirs = process.argv.slice(3);

// Конфигурация игнорирования
const config = {
    ignoreDirs: ['.vs', 'node_modules', 'public', '.git', ...additionalIgnoreDirs],
    ignoreExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.bmp', '.ico'],
    ignoreFiles: ['package-lock.json'],
};

// Добавление стилей в игнорируемые директории
if (ignoreStyles) {
    config.ignoreDirs.push('styles');
}

// Игнорируем build и dist в зависимости от секции
if (section === 'frontend') {
    config.ignoreDirs.push('build');
} else if (section === 'backend') {
    config.ignoreDirs.push('dist');
} else {
    config.ignoreDirs.push('build', 'dist');
}

// Функция для получения структуры проекта
function getProjectStructure(dir, structure = '', prefix = '') {
    const files = fs.readdirSync(dir);

    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;
        const newPrefix = prefix + (isLast ? '└── ' : '├── ');

        structure += `${newPrefix}${file}\n`;

        if (stats.isDirectory() && !config.ignoreDirs.includes(file)) {
            const newPrefixRecursive = prefix + (isLast ? '    ' : '│   ');
            structure = getProjectStructure(filePath, structure, newPrefixRecursive);
        }
    });

    return structure;
}

// Функция для сбора файлов
function collectFiles(dir, relativeDir = '', allFiles = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const relativeFilePath = path.join(relativeDir, file);

        if (stats.isDirectory() && !config.ignoreDirs.includes(file)) {
            collectFiles(filePath, relativeFilePath, allFiles);
        } else if (stats.isFile()) {
            const fileExtension = path.extname(file).toLowerCase();
            if (!config.ignoreExtensions.includes(fileExtension) && !config.ignoreFiles.includes(file)) {
                allFiles.push(relativeFilePath);
            }
        }
    });

    return allFiles;
}

// Основная функция
async function collectProjectFiles(section) {
    const rootDir = 'C:\\Users\\slava\\my-game'; // Путь к корневой директории
    const srcDir = path.join(rootDir, 'src');
    const backendDir = path.join(rootDir, 'backend');

    let structure = '--- Структура проекта ---\n';
    let allFiles = [];
    let outputFileName = ignoreStyles ? 'game-full-no-styles.txt' : 'game-full.txt';

    if (section === 'frontend') {
        structure += getProjectStructure(srcDir);
        allFiles = collectFiles(srcDir, 'src');
        outputFileName = ignoreStyles ? 'game-front-no-styles.txt' : 'game-front.txt';
    } else if (section === 'backend') {
        structure += getProjectStructure(backendDir);
        allFiles = collectFiles(backendDir, 'backend');
        outputFileName = 'game-back.txt';
    } else {
        structure += getProjectStructure(rootDir);
        allFiles = [...collectFiles(srcDir, 'src'), ...collectFiles(backendDir, 'backend')];
    }

    structure += '\n--- Содержимое файлов ---\n';

    // Путь к файлу на рабочем столе
    const outputFilePath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', outputFileName);
    const writeStream = fs.createWriteStream(outputFilePath, { flags: 'w' });

    // Записываем структуру в начало файла
    writeStream.write(structure);

    for (const filePath of allFiles) {
        try {
            const fullPath = path.join(rootDir, filePath);
            const stats = fs.statSync(fullPath);

            if (stats.isFile()) {
                const content = await fs.promises.readFile(fullPath, 'utf8');
                writeStream.write(`--- Содержимое файла: ${filePath} ---\n`);
                writeStream.write(content + '\n');
            }
        } catch (err) {
            console.error(`Ошибка чтения файла ${filePath}: ${err.message}`);
            writeStream.write(`Ошибка чтения файла ${filePath}: ${err.message}\n`);
        }
    }

    writeStream.end(() => {
        console.log(`Текстовые файлы из раздела ${section} записаны в ${outputFilePath}`);
    });
}

// Запуск с учетом флага игнорирования стилей
collectProjectFiles(section);
