prey_velocity = 8;
prey_num_genes = 256;
prey_population = 32;
prey_mutation_rate = 0.03;
prey_generation = 0;
prey_avg_fitness = 0;

preys = [];
predators = [];

predator_velocity = 4;
predator_population = 4;
predator_num_genes = 256;
predator_mutation_rate = 0.01;
predator_generation = 0;
predator_avg_fitness = 0;

class predator {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.idx = 0;
    this.fitness = 0;
    this.done = false;
    this.createGenes();
  }
  update() {
    if (this.idx < predator_num_genes) {
      if (this.x + predator_velocity * this.genes[this.idx].x < 0 ||
          this.x + predator_velocity * this.genes[this.idx].x > 700) {
        this.genes[this.idx].x = -1 * this.genes[this.idx].x;
        this.genes[this.idx].y = -1 * this.genes[this.idx].y;
      }
      if (this.y + predator_velocity * this.genes[this.idx].y < 0 ||
          this.y + predator_velocity * this.genes[this.idx].y > 700) {
        this.genes[this.idx].x = -1 * this.genes[this.idx].x;
        this.genes[this.idx].y = -1 * this.genes[this.idx].y;
      }
      this.x += predator_velocity * this.genes[this.idx].x;
      this.y += predator_velocity * this.genes[this.idx].y;
      this.idx ++;
    }
  }
  createGenes() {
    this.genes = [];
    for (var i = 0; i < predator_num_genes; i ++) {
      this.genes[i] = p5.Vector.random2D();
    }
  }
  calcFitness() {
    for (var i = 0; i < prey_population; i ++) {
      var preydistance = Math.sqrt((this.x - preys[i].x) ** 2 + (this.y - preys[i].y) ** 2);
      this.fitness = Math.min(preydistance, this.fitness)
    }
    this.fitness = -1 * this.fitness;
  }
}

class prey {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.idx = 0;
    this.fitness = 0;
    this.done = false;
    this.createGenes();
  }
  update() {
    if (this.x == 350 && this.y == 650) {
      this.done = true;
      this.idx ++;
    } else if (this.idx < prey_num_genes) {
      if (this.x + prey_velocity * this.genes[this.idx].x < 0 ||
          this.x + prey_velocity * this.genes[this.idx].x > 700) {
        this.genes[this.idx].x = -1 * this.genes[this.idx].x;
        this.genes[this.idx].y = -1 * this.genes[this.idx].y;
      }
      if (this.y + prey_velocity * this.genes[this.idx].y < 0 ||
          this.y + prey_velocity * this.genes[this.idx].y > 700) {
        this.genes[this.idx].x = -1 * this.genes[this.idx].x;
        this.genes[this.idx].y = -1 * this.genes[this.idx].y;
      }
      this.x += prey_velocity * this.genes[this.idx].x;
      this.y += prey_velocity * this.genes[this.idx].y;
      this.idx ++;
    } 
  }
  createGenes() {
    this.genes = [];
    for (var i = 0; i < prey_num_genes; i ++) {
      this.genes[i] = p5.Vector.random2D();
    }
  }
  calcFitness() {
    for (var i = 0; i < predator_population; i ++) {
      var predatordistance = Math.sqrt((this.x - preys[i].x) ** 2 + (this.y - preys[i].y) ** 2);
      this.fitness = Math.max(predatordistance, this.fitness);
    }
    var fooddistance = Math.sqrt((this.x - 650) ** 2 + (this.y - 650) ** 2);
    this.fitness = -1 * predatordistance + fooddistance;
  }
}

function setup() {
  console.log(prey_generation);
  console.log(predator_generation);
  createCanvas(700, 700);
  for (var i = 0; i < prey_population; i ++) {
    preys[i] = new prey(350, 100);
  }
  for (var i = 0; i < predator_population; i ++) {
    predators[i] = new predator(100, 650);
  }
}

function prey_nextGeneration() {
  prey_generation ++;
  console.log(prey_generation);
  for (var i = 0; i < prey_population; i ++) {
    preys[i].calcFitness();
  }
  preys.sort((a, b) => {
    return a.fitness < b.fitness;
  });
  nextpreys = [];
  for (var k = 0; k < prey_population; k ++) {
    var nextprey = new prey(preys[k].x, preys[k].y);
    var dad = floor(abs(random() - random()) ** 8 * prey_population);
    var mom = floor(abs(random() - random()) ** 8 * prey_population);
    for (var j = 0; j < prey_num_genes; j ++) {
      if (random() < prey_mutation_rate) {
        nextprey.genes[j] = p5.Vector.random2D();
      } else {
        nextprey.genes[j].x = (preys[dad].genes[j].x + preys[mom].genes[j].x) / 2;
        nextprey.genes[j].y = (preys[dad].genes[j].y + preys[mom].genes[j].y) / 2;
      }
    }
    nextpreys.push(nextprey);
  }
  preys = nextpreys;
}

function predator_nextGeneration() {
  predator_generation ++;
  console.log(predator_generation);
  for (var i = 0; i < predator_population; i ++) {
    predators[i].calcFitness();
  }
  predators.sort((a, b) => {
    return a.fitness < b.fitness;
  });
  nextpredators = [];
  for (var k = 0; k < predator_population; k ++) {
    var nextpredator = new prey(predators[k].x, predators[k].y);
    var dad = floor(abs(random() - random()) ** 16 * predator_population);
    var mom = floor(abs(random() - random()) ** 16 * predator_population);
    for (var j = 0; j < predator_num_genes; j ++) {
      if (random() < predator_mutation_rate) {
        nextpredator.genes[j] = p5.Vector.random2D();
      } else {
        nextpredator.genes[j].x = (predators[dad].genes[j].x + predators[mom].genes[j].x) / 2;
        nextpredator.genes[j].y = (predators[dad].genes[j].y + predators[mom].genes[j].y) / 2;
      }
    }
    nextpredators.push(nextpredator);
  }
  predators = nextpredators;
}

function draw() {
  
  if (prey_population <= 0) {
    console.log("Preys are Dead");
    noLoop(); 
  }
    
  background(204);
  fill(100, 100, 255);
  
  var food = 0;
  for (var j = 0; j < prey_population; j ++) {
    preys[j].update();
    if (preys[j].x > 650 && preys[j].x < 690 && preys[j].y > 650 && preys[j].y < 690)
      food ++;
    ellipse(preys[j].x, preys[j].y, 8, 8);
  }
  
  var killed = 0;
  fill(255, 51, 51)
  for (var i = 0; i < predator_population; i ++) {
    predators[i].update();
    ellipse(predators[i].x, predators[i].y, 12, 12);
    for (var j = 0; j < prey_population; j ++) {
      if (abs(preys[j].x - predators[i].x) < 4 && abs(preys[j].y - predators[i].y) < 4)
        killed ++;
    }
  }
  
  //prey_population += food - killed;
  
  if (preys[0].idx == prey_num_genes)
    prey_nextGeneration();
  
  if (predators[0].idx == predator_num_genes)
    predator_nextGeneration();
  
  fill(0, 128, 0);
  rect(650, 650, 40, 40);
}
