"use strict";

var mongoose = require('mongoose');
var Project = mongoose.model('Project');

// Seeder example, seed 1 new project:
new Project({
  title: "Im seeded"
}).save();