/**
 * Created by George on 2/26/2017.
 */

'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  FAQ = require('mongoose').model('FAQ'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
exports.create = function(req, res, next) {
  var faq = new FAQ(req.body);
  faq.save(function (err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(faq);
    }
  });
};

exports.list = function(req, res) {
    FAQ.find({}, function(err, data) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.json(data);
        }
    });
};
//
// exports.delete = function(req, res, next) {
//     req.faq.remove(function(err) {
//         if (err) {
//             return next(err);
//         }
//         else {
//             res.json(req.faq);
//         }
//     });
// };
//
// exports.read = function(req, res) {
//     res.json(req.faq);
// };
//
exports.faqById = function(req, res, next, id) {
    FAQ.findOne({
            _id: id
        },
        function(err, faq) {
            if (err) {
                return next(err);
            }
            else {
                req.faq = faq;
                next();
            }
        }
    );
};
//
// exports.update = function (req, res) {
//     // var faq = req.faq;
//     //
//     // faq.title = req.body.title;
//     // project.description.long = req.body.description.long;
//     //
//     // project.save(function (err) {
//     //     if (err) {
//     //         return res.status(400).send({
//     //             message: errorHandler.getErrorMessage(err)
//     //         });
//     //     } else {
//     //         res.json(project);
//     //     }
//     // });
// };
