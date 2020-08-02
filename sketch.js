palettes = {
  palette_1: [[221, 255, 247], [255, 210, 252], [233, 128, 252], [185, 106, 201], [35, 27, 27]],
  palette_2: [[84, 35, 68], [191, 209, 229], [235, 245, 238], [216, 191, 170], [128, 128, 128]],
  palette_3: [[215, 38, 61], [2, 24, 43], [1, 151, 246], [68, 143, 163], [104, 197, 219]],
  palette_4: [[139,22,24], [146,56,51], [181,156,139], [207,206,205], [189,184,168]],
}

const opts = {
  width: 900,
  height: 900,
  Redraw_Background: false,

  Particles: 250,
  Draw_Outline: false,
  Draw_Center: false,
  Draw_Link: true,

  White_Amount: 0.2,
  Color_1: [84, 35, 68],
  Color_2: [191, 209, 229],
  Color_3: [235, 245, 238],
  Color_4: [216, 191, 170],
  Color_5: [128, 128, 128],
  Palettes: palettes.palette_1,

  Generate: () => randomize(),
  Save: () => save(),
};

window.onload = function() {
  var gui = new dat.GUI();
  var img = gui.addFolder('Image Settings');
  img.add(opts, 'width', 200, 1400).step(1)
  img.add(opts, 'height', 200, 1400).step(1)
  img.add(opts, 'Redraw_Background')
  
  let gen = gui.addFolder('Generation Settings')
  gen.add(opts, 'Particles').onChange(randomize)
  gen.add(opts, 'Draw_Link').onChange(randomize)
  gen.add(opts, 'Draw_Outline').onChange(randomize)
  gen.add(opts, 'Draw_Center').onChange(randomize)
  gen.open();
  
  let col = gui.addFolder('Color Settings')
  col.add(opts, 'White_Amount', 0, 1).step(.1);
  col.addColor(opts, 'Color_1').listen();
  col.addColor(opts, 'Color_2').listen();
  col.addColor(opts, 'Color_3').listen();
  col.addColor(opts, 'Color_4').listen();
  col.addColor(opts, 'Color_5').listen();
  col.add(opts, 'Palettes', palettes).onChange(updateColors)
  col.open();
  
  gui.add(opts, 'Generate');
  gui.add(opts, 'Save');
};

let circles = []
let paletteRGB

function setup() {
  createCanvas(opts.width, opts.height)
  background(4);
  paletteRGB = [opts.Color_1,opts.Color_2,opts.Color_3,opts.Color_4,opts.Color_5]
  for (let i = 0; i < opts.Particles; i++) {
    circles.push(new Particle(createVector(random(width/2-10, width/2+10), random(height/2-10, height/2+10)), random()>opts.White_Amount))
  }
}

function draw() {
  if(opts.Redraw_Background)
    background(4);
  for (let i = 0; i < opts.Particles ; i++) {
    if(opts.Draw_Outline)
      circles[i].display()
      
    if(opts.Draw_Center)
      circles[i].displayCenter()
    circles[i].update()
    for (let j = i + 1; j < opts.Particles; j++) {
      if(circles[i].overlaps(circles[j])) {
        if(opts.Draw_Link)
          circles[i].link(circles[j])
        circles[i].avoid(circles[j])
        circles[j].avoid(circles[i])
      }
    }
  }
}

function randomize() {
  circles = []
  setup()
}

function updateColors(palette) {
  values = palette.split(',')
  for (let i = 5; i > 0; i--) {
    let color = []
    for (let j = 0; j < 3; j++) {
      c = values.pop()
      color.push(c)
    }
    color = color.reverse()
    opts['Color_'+i] = color
  }
}

function keyPressed(key) {
  if(key.keyCode === 80)
    save()
}
