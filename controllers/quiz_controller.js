var models = require('../models/models.js');

exports.load  =function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
	function(quiz) {
		if(quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId= '+quizId));
		}
	}).catch(function(error) {next(error);});
};

exports.index = function(req, res) {
	var search = req.query.search;
	if(search) {	
		search = "%"+search.replace(/\s/g, '%')+"%";				
	} else {				
		search = "%";
	}
	models.Quiz.findAll({where:["pregunta like ?", search]}).then(function(quizes) {
	res.render('quizes/index', {quizes: quizes, errors: []});	
	}).catch(function(error) {next(error);});

};

exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz, errors: []});	
	})	
};

exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		var resultado = 'Incorrecto';
		if(req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';			
		}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
	})	
};

exports.new = function(req, res) {
	var quiz = models.Quiz.build(
	{pregunta: "", respuesta: ""}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res) {  
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz 
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      
    }
  );
};

exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res) {  
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
    
  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz 
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      
    }
  );
};

exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error) {next(error);});
};