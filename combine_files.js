const fs = require('fs');
const path = require('path');

// Получаем аргументы командной строки
const section = process.argv[2] || 'all'; // Первый аргумент: 'frontend', 'backend', или ничего (для обоих)
const ignoreStyles = process.argv.includes('--ignore-styles'); // Флаг для игнорирования стилей
const additionalIgnoreDirs = process.argv.slice(3); // Дополнительные игнорируемые директории

// Конфигурация игнорирования
const config = {
    ignoreDirs: ['.vs', 'node_modules', 'public', '.git', ...additionalIgnoreDirs], // Игнорируемые директории
    ignoreExtensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.bmp', '.ico'], // Игнорируемые расширения
    ignoreFiles: ['package-lock.json'], // Игнорируемые файлы
};

// Если не нужно собирать стили, добавляем папку стилей в игнорируемые директории
if (ignoreStyles) {
    config.ignoreDirs.push('styles');
    console.log("Папка 'styles' будет игнорироваться при сборе.");
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
            } else {
                console.log(`Игнорируем директорию: ${file}`);
            }
        }
    });

    return structure;
}

// Функция для сбора файлов с сохранением структуры
function collectFiles(dir, relativeDir, allFiles = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const relativeFilePath = path.join(relativeDir, file);

        if (stats.isDirectory()) {
            if (!config.ignoreDirs.includes(file)) {
                collectFiles(filePath, relativeFilePath, allFiles);
            }
        } else {
            const fileExtension = path.extname(file).toLowerCase();
            if (!config.ignoreExtensions.includes(fileExtension) && !config.ignoreFiles.includes(file)) {
                allFiles.push(relativeFilePath); // Сохраняем относительный путь
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
    let outputFileName = ignoreStyles ? 'game-full-no-styles.txt' : 'game-full.txt'; // Имя файла с учетом флага

    if (section === 'frontend') {
        structure += getProjectStructure(srcDir);
        allFiles = collectFiles(srcDir, 'src'); // Указываем относительный путь
        outputFileName = ignoreStyles ? 'game-front-no-styles.txt' : 'game-front.txt';
    } else if (section === 'backend') {
        structure += getProjectStructure(backendDir);
        allFiles = collectFiles(backendDir, 'backend'); // Указываем относительный путь
        outputFileName = 'game-back.txt';
    } else {
        structure += getProjectStructure(rootDir);
        allFiles = [...collectFiles(srcDir, 'src'), ...collectFiles(backendDir, 'backend')]; // Указываем относительный путь
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
            // Используем полный путь к файлу для чтения, но сохраняем структуру
            const content = await fs.promises.readFile(path.join(rootDir, filePath), 'utf8');
            writeStream.write(`--- Содержимое файла: ${filePath} ---\n`); // Заголовок для файла
            writeStream.write(content + '\n');
        } catch (err) {
            console.error(`Ошибка чтения файла ${filePath}: ${err.message}`);
            writeStream.write(`Ошибка чтения файла ${filePath}: ${err.message}\n`); // Запись ошибки в файл
        }
    }

    writeStream.end(() => {
        console.log(`Все текстовые файлы из раздела ${section === 'frontend' ? 'src' : section === 'backend' ? 'backend' : 'src и backend'} записаны в ${outputFilePath}`);
    });
}

// Запуск основной функции с учетом флага игнорирования стилей
collectProjectFiles(section);
