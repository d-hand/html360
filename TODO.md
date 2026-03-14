# TODO

## Unreleased
- [ ] Редактирование. Туры %)
- [ ] В pannelum есть ограничение на браузеры. Возможно это как-то должно повлиять на мою сборку, но это не точно...
- [ ] Выводи информации сколько весит js и css который добавляется в html
- [ ] Тесты
- [ ] Добавить логотип в терминал image-to-ascii


## ??? ## 
- Узнать про С++ в sharp %)
- Cобирать это в .exe файл (например, через pkg или bun build), чтобы пользоваться утилитой было удобнее?
- Тонкая настройка sharp и plimit, чтобы избежать out of memory (кажется, сейчас это очень редки кейс)
- WebXR/VR Mode: Кнопка для перехода в режим виртуальной реальности (для Google Cardboard или Oculus).
- pannellum. Предложить/PR создавать sourcemap 
- pannellum. Предложить/PR создавать d.ts

## %) ## 
- Хочешь, набросаем мини-логгер, который будет рисовать график потребления прямо в консоли во время работы? Визуально это выглядит очень круто!
- html360 на андройд и ios


## Publish
1.  **Собрать пакет** `npm run build` 
3.  Запаковать 'npm pack`
4.  Удалить артефакты разработки `html360 uninstall-menu` `npm unlink` `npm uninstall -g html360`    
5.  Установить глобально из архива `npm install -g ./html360-x.x.x.tgz`
6.  **Проверить все команды html360**
7.  **Проверить CHANGELOG** Обратить вниание на дату релиза
8.  Создать коммит в мастер: `feat: release x.x.x`, `Update README.md`, ...
9.  **Создать коммит выпуска новой версии** `npm version x.x.x && npm run build`
10. **Последний раз все проверить**
11. Создать релиз на github (опционально)
12. Логин `npm login`
13. Выложить `npm publish`



<!-- 

Релиз 
html360 — v2.4.0 "The Creator Update"
This version transforms html360 from a passive viewer into an autonomous editor. We’ve stripped away the clutter to let your panoramas shine, while giving you the power to "freeze" the perfect view directly into the file.


    hotSpots: [
      {
        pitch: 14.1,
        yaw: 1.5,
        type: "scene",
        text: "Baltimore Museum of Art",
        URL: "./DJI_20241012165448_0149_D_3.html",
        attributes: { target: "_self"}
      },
      {
        pitch: -9.4,
        yaw: 222.6,
        type: "info",
        text: "Art Museum Drive",
      },
    ],



function getTours(imgPath: string, ctx: Context) {
  const htmlPath = getHtmlPath(imgPath, ctx.options);
  const tours = ctx.imgPaths
    .filter((x) => x !== imgPath)
    .map((x) => getHtmlPath(x, ctx.options))
    .map((x) => {
      let rel = path.relative(path.dirname(htmlPath), x);

      // Node.js может вернуть 'file.html', но для браузера лучше './file.html'
      if (!rel.startsWith(".")) rel = "./" + rel;

      // Заменяем обратный слэш на прямой
      rel = rel.split(path.sep).join("/");

      return rel;
    });

  return tours;
}


-->

