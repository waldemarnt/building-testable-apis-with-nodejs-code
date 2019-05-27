before(()=> setupApp()
    .then(app => {
      global.request = supertest(app)
    }));
