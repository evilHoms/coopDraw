
// Отрпавка начальной страницы
const rootHandler = (req, res) => {
  const staticPath = '/public';
  res.writeHead(200);
  res.write(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    
      <link href="${staticPath}/main.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Architects+Daughter" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">
    
      <title>Coop Draw</title>
    
    </head>
    
    
    <body>
    
      <div id="root">
    
        <h1 class="coop-draw-title">
          Coop Draw
        </h1>
      
        <header class="controlls">
          <button class="new-room--btn">New Room</button>
        </header>
      
        <main class="rooms">
          <h2 class="rooms__title">
            Rooms
          </h2>
          <div class="rooms__list"></div>
        </main>
      
        <div class="canvas-loader hidden">
          LOADING...
        </div>
    
        <section class="editor hidden">
          <div class="users">
            Users
          </div>
          <div class="canvas-wrapper">
            <aside class="editor__menu">
              Editor menu
            </aside>
            <canvas id="canvas">
              Your browser doesnt supports.
            </canvas>
            <img crossorigin="anonymous" class="editor__image hidden" src="#" alt="canvas image">
          </div>
        </section>
    
      </div>
      <script src="${staticPath}/bundle.js"></script>
    </body>
    </html>
    `
  );
  res.end();
}

export { rootHandler };