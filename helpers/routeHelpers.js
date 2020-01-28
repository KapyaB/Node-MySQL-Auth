const Joi = require("joi");

module.exports = {
  // request body validations
  validateBody: schema => {
    return (req, res, next) => {
      // validate data
      const result = Joi.validate(req.body, schema, { abortEarly: false }); // false: in case there is more than one error

      const err = result.error;

      if (err) {
        // custom errors
        var errors = [];

        // map over default error array
        err.details.map(err => {
          const { type, context } = err;

          // required fields
          if (type === "any.required") {
            errors.push({
              error: `${
                context.label === "password2"
                  ? "Password confirmation"
                  : context.label
              } is required.`
            });
          }

          // value too short
          if (type === "string.min") {
            errors.push({
              error: `${context.label} must be at least ${context.limit} characters long`
            });
          }

          // value too long
          if (type === "string.max") {
            errors.push({
              error: `${context.label} must not exceed ${context.limit} characters`
            });
          }

          // email validation
          if (type === "string.email") {
            errors.push({ error: "Please provide a valid email address" });
          }

          // passwords don't match
          if (type === "allowOnly") {
            errors.push({ error: "Passwords do not match" });
          }
        });

        return res.status(400).json({ errors });
      }

      // create an object of validated values to pass to the controllers
      if (!req.value) {
        req.value = {};
      }

      req.value["body"] = result.value;
      next();
    };
  },

  // validations schemas
  schemas: {
    signUpSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      username: Joi.string()
        .min(3)
        .max(25)
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
      password2: Joi.string()
        .valid(Joi.ref("password"))
        .required()
    }),
    signInSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .error(new Error("Please provide a valid email address"))
        .required()
        .error(new Error("Email fiels is required")),
      password: Joi.string()
        .min(6)
        .required()
    }),
    justEmail: Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
    }),
    password: Joi.object().keys({
      password: Joi.string()
        .min(6)
        .required(),
      password2: Joi.ref("password")
    })
  }
};
