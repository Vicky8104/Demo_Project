import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:100,
    message:"Too many requests, try later"
});

export const loginLimiter = rateLimit({
    windowMs: 10*60*1000,
    max:100,
    message:"Too many Login attempts."
});

export const otpLimiter = rateLimit({
    windowMs: 5*60*1000,
    max:5,
   keyGenerator: (req) => ipKeyGenerator(req),
    message:"Too many otp requests",
});