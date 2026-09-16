const express = require("express");

const naverOnboardingRouter = require("./routes/naverOnboarding");
const naverLoginRouter = require("./routes/naverLogin");
const naverTermsRouter = require("./routes/naverTerms");
const naverPlacesRouter = require("./routes/naverPlaces");
const naverImageRouter = require("./routes/naverImage");

function attachNaverRoutes(app) {
  const path = require("path");
  app.use(express.json());
  app.use(
    "/naver/assets",
    express.static(path.join(__dirname, "ui", "assets"))
  );
  app.use("/naver/start", naverOnboardingRouter);
  app.get("/naver/logout", naverLoginRouter.handleNaverLogout);
  app.use("/naver/login", naverLoginRouter);
  app.use("/naver/terms", naverTermsRouter);
  app.use("/naver/places", naverPlacesRouter);
  app.use("/naver/image", naverImageRouter);
}

module.exports = { attachNaverRoutes };
