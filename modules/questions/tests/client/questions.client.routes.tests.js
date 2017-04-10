(function () {
  'use strict';

  describe('Questions Route Tests', function () {
    // Initialize global variables
    var $scope,
      QuestionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QuestionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QuestionsService = _QuestionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('questions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/questions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          QuestionsController,
          mockQuestion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('questions.view');
          $templateCache.put('modules/questions/client/views/view-question.client.view.html', '');

          // create mock Question
          mockQuestion = new QuestionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Question Name'
          });

          // Initialize Controller
          QuestionsController = $controller('QuestionsController as vm', {
            $scope: $scope,
            questionResolve: mockQuestion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:questionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.questionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            questionId: 1
          })).toEqual('/questions/1');
        }));

        it('should attach an Question to the controller scope', function () {
          expect($scope.vm.question._id).toBe(mockQuestion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/questions/client/views/view-question.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QuestionsController,
          mockQuestion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('questions.create');
          $templateCache.put('modules/questions/client/views/form-question.client.view.html', '');

          // create mock Question
          mockQuestion = new QuestionsService();

          // Initialize Controller
          QuestionsController = $controller('QuestionsController as vm', {
            $scope: $scope,
            questionResolve: mockQuestion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.questionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/questions/create');
        }));

        it('should attach an Question to the controller scope', function () {
          expect($scope.vm.question._id).toBe(mockQuestion._id);
          expect($scope.vm.question._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/questions/client/views/form-question.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QuestionsController,
          mockQuestion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('questions.edit');
          $templateCache.put('modules/questions/client/views/form-question.client.view.html', '');

          // create mock Question
          mockQuestion = new QuestionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Question Name'
          });

          // Initialize Controller
          QuestionsController = $controller('QuestionsController as vm', {
            $scope: $scope,
            questionResolve: mockQuestion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:questionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.questionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            questionId: 1
          })).toEqual('/questions/1/edit');
        }));

        it('should attach an Question to the controller scope', function () {
          expect($scope.vm.question._id).toBe(mockQuestion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/questions/client/views/form-question.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
