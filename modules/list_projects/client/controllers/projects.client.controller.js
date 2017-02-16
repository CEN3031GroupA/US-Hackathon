'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects',
    function ($scope, $stateParams, $location, Authentication, Projects) {
        $scope.authentication = Authentication;

        // Create new Project
        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'projectForm');

                return false;
            }

            // Create new Project object
            var project = new Projects({
                title: this.title,
                content: this.content
            });

            // Redirect after save
            project.$save(function (response) {
                $location.path('projects/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.detail = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Project
        $scope.remove = function (project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects[i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function () {
                    $location.path('projects');
                });
            }
        };

        // Update existing Project
        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'projectForm');

                return false;
            }

            var project = $scope.project;

            project.$update(function () {
                $location.path('projects/' + project._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Projects
        $scope.find = function () {
            $scope.projects = Projects.query();
        };

        // Find existing Project
        $scope.findOne = function () {
            $scope.project = Projects.get({
                projectId: $stateParams.projectId
            });
        };
    }
]);
