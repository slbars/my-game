const fs = require('fs');
const path = require('path');

// Получаем аргументы командной строки
const section = process.argv[2] || 'all'; // Первый аргумент: 'frontend', 'backend', или ничего (для обоих)
const ignoreStyles = process.argv.includes('--ignore-styles'); // Второй аргумент: флаг для игнорирования стилей

// Конфигурация игнорирования
const config = {
    ignoreDirs: ['.vs', 'node_modules', 'public'], // Игнорируемые директории
    ignoreExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.bmp', '.ico'], // Игнорируемые расширения
    ignoreFiles: ['package-lock.json'], // Игнорируемые файлы
};

// Если не нужно собирать стили, добавляем папку стилей в игнорируемые директории
if (ignoreStyles) {
    config.ignoreDirs.push('styles');
}

// Функция для сбора структуры проекта
function getProjectStructure(dir, structure = '', prefix = '') {
    const files = fs.readdirSync(dir);

    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;
        const newPrefix = prefix + (isLast ? '└── ' : '├── ');

        structure += `${newPrefix}${file}\n`;

        if (stats.isDirectory()) {
            if (!config.ignoreDirs.includes(file)) {
                const newPrefixRecursive = prefix + (isLast ? '    ' : '│   ');
                structure = getProjectStructure(filePath, structure, newPrefixRecursive);
            }
        }
    });

    return structure;
}

// Функция для сбора файлов
function collectFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            if (!config.ignoreDirs.includes(file)) {
                collectFiles(filePath, allFiles);
            }
        } else {
            const fileExtension = path.extname(file).toLowerCase();
            if (!config.ignoreExtensions.includes(fileExtension) && !config.ignoreFiles.includes(file)) {
                allFiles.push(filePath);
            }
        }
    });

    return allFiles;
}

// Основная функция
async function collectProjectFiles(section) {
    const rootDir = 'C:\\Users\\slava\\my-game'; // Путь к корневой директории проекта
    const srcDir = path.join(rootDir, 'src');
    const backendDir = path.join(rootDir, 'backend');

    let structure = '--- Структура проекта ---\n';
    let allFiles = [];
    let outputFileName = 'game-full.txt'; // Имя файла по умолчанию

    if (section === 'frontend') {
        structure += getProjectStructure(srcDir);
        allFiles = collectFiles(srcDir);
        outputFileName = 'game-front.txt';
    } else if (section === 'backend') {
        structure += getProjectStructure(backendDir);
        allFiles = collectFiles(backendDir);
        outputFileName = 'game-back.txt';
    } else {
        structure += getProjectStructure(rootDir);
        allFiles = [...collectFiles(srcDir), ...collectFiles(backendDir)];
    }

    structure += '\n--- Содержимое файлов ---\n';

    // Путь к выходному файлу на рабочем столе
    const outputFilePath = path.join(
        process.env.HOME || process.env.USERPROFILE,
        'Desktop',
        outputFileName // Выбираем имя файла в зависимости от раздела
    );
    const writeStream = fs.createWriteStream(outputFilePath, { flags: 'w' });

    // Записываем структуру проекта в начале файла
    writeStream.write(structure);

    for (const filePath of allFiles) {
        try {
            const content = await fs.promises.readFile(filePath, 'utf8');
            writeStream.write(content + '\n');
        } catch (err) {
            console.error(`Ошибка чтения файла ${filePath}: ${err.message}`);
        }
    }

    writeStream.end(() => {
        console.log(`Все текстовые файлы из раздела ${section === 'frontend' ? 'src' : section === 'backend' ? 'backend' : 'src и backend'} записаны в ${outputFilePath}`);
    });
}

// Запуск основной функции с учетом флага игнорирования стилей
collectProjectFiles(section);
