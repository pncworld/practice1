const express = require("express");

const naverOnboardingRouter = require("./routes/naverOnboarding");
const naverLoginRouter = require("./routes/naverLogin");
const naverTermsRouter = require("./routes/naverTerms");
const naverPlacesRouter = require("./routes/naverPlaces");

function attachNaverRoutes(app) {
  app.use(express.json());
  app.use("/naver/start", naverOnboardingRouter);
  app.use("/naver/login", naverLoginRouter);
  app.use("/naver/terms", naverTermsRouter);
  app.use("/naver/places", naverPlacesRouter);
}

module.exports = { attachNaverRoutes };
