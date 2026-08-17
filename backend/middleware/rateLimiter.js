import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// export const globalLimiter = rateLimit({
//     windowMs: 15*60*1000,
//     max:1000,
//     message:"Too many requests, try later"
// });
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

// export const loginLimiter = rateLimit({
//     windowMs: 10*60*1000,
//     max:100,
//     message:"Too many Login attempts."
// });

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  }
});

export const otpLimiter = rateLimit({
    windowMs: 5*60*1000,
    max:5,
   keyGenerator: (req) => ipKeyGenerator(req),
    message:"Too many otp requests",
});
