# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.6.0](https://github.com/hjmosedk/eCommerceAPI/compare/v0.5.1...v0.6.0) (2025-02-26)


### ⚠ BREAKING CHANGES

* **orders:** order pagination added
* **product:** pagination

### Features

* **capturePaymen:** the payment can now be captured ([01918dc](https://github.com/hjmosedk/eCommerceAPI/commits/01918dc7657403e38c9bb4b3a0d000764b36e387)), closes [#15](https://github.com/hjmosedk/eCommerceAPI/issues/15)
* **email:** the system is now able to sent emails ([586be0b](https://github.com/hjmosedk/eCommerceAPI/commits/586be0b67ebc0478bb25ca51686debebdc78c8c2)), closes [#1](https://github.com/hjmosedk/eCommerceAPI/issues/1)
* **internalEmail:** the app now sends out email on selected state change ([ff9e711](https://github.com/hjmosedk/eCommerceAPI/commits/ff9e7118fd55dc81c2d65cd8379e262701c53ffe)), closes [#2](https://github.com/hjmosedk/eCommerceAPI/issues/2)
* **main:** the app is now hosted ower HTTPS ([0e3bc14](https://github.com/hjmosedk/eCommerceAPI/commits/0e3bc148b510de2be5deed1347ece6e40dfdd048))
* **orderDTO:** adjusted the order to not include sens ([f2dcf35](https://github.com/hjmosedk/eCommerceAPI/commits/f2dcf35c87c34b0685342f2a7a364d4b44ffd47c)), closes [#25](https://github.com/hjmosedk/eCommerceAPI/issues/25)
* **orders:** order pagination added ([76ce09a](https://github.com/hjmosedk/eCommerceAPI/commits/76ce09ae46560d15e2c27ea97c09493ac7892c1e)), closes [#4](https://github.com/hjmosedk/eCommerceAPI/issues/4)
* **payment:** added payment services to the application ([3cb4512](https://github.com/hjmosedk/eCommerceAPI/commits/3cb4512b098470fc9c6e9cca68156d5cad363321))
* **payment:** created payment possiblities ([7a441e2](https://github.com/hjmosedk/eCommerceAPI/commits/7a441e2534efa0167cd5babf58702ddef95e1605))
* **payment:** prepared they payment for future collection ([87772a0](https://github.com/hjmosedk/eCommerceAPI/commits/87772a0201ab3763c354fd005492708d6135ad2f))
* **product:** pagination ([ebd7bc9](https://github.com/hjmosedk/eCommerceAPI/commits/ebd7bc982a046a4c5ac8953b71fef3d0972d3f20)), closes [#3](https://github.com/hjmosedk/eCommerceAPI/issues/3)
* **setting:** added the setting controllere ([688befd](https://github.com/hjmosedk/eCommerceAPI/commits/688befd80b186e66ec97ac23a8eb1441d8c6abbc))
* **setting:** adjusted settings and allowed for dataseeding ([d63e439](https://github.com/hjmosedk/eCommerceAPI/commits/d63e4390919836514180d8400918863fc38196ab))
* **settings:** added a settings module, to store central information ([df0d0ac](https://github.com/hjmosedk/eCommerceAPI/commits/df0d0ac22d52039df98b0c50208bda4833c5600b))


### Bug Fixes

* **dbSchema:** fixed a bug in the type of the DB schema for orders ([1ac9c85](https://github.com/hjmosedk/eCommerceAPI/commits/1ac9c8533ccd753307853b12339aadc87a922799))
* **messageModule:** fixed a bug in the from ([c7f27a7](https://github.com/hjmosedk/eCommerceAPI/commits/c7f27a75147ab4c28791837c313c2f97a715a87f))
* **newOrder:** fixed a bug not setting ordre notes correctly ([3a9538c](https://github.com/hjmosedk/eCommerceAPI/commits/3a9538c116d0490a4dc85e09b235d515d7c289c3))
* **orderEnity:** orderTotalPrice is now correctly an int and not a string ([19bc270](https://github.com/hjmosedk/eCommerceAPI/commits/19bc270b39e2e4c352af4786721a4377b294f8c8))
* **orderModel:** added some data to the order model ([9c2d9e7](https://github.com/hjmosedk/eCommerceAPI/commits/9c2d9e7d71886389bfdde1ebd931c501437469fe))
* **product:** fixed a bug where the wrong product table where used, p vs capital P ([483b37e](https://github.com/hjmosedk/eCommerceAPI/commits/483b37eba022169bd5521327364301958856dd84))
* **productService:** fixed the getall bug ([553868b](https://github.com/hjmosedk/eCommerceAPI/commits/553868b76d8cfe51316f81b1b2af91ad23e08ef9)), closes [#24](https://github.com/hjmosedk/eCommerceAPI/issues/24)
* **readme:** fixed a but in the readme ([f07d344](https://github.com/hjmosedk/eCommerceAPI/commits/f07d34441f827754926be8d1894c94b829b7ce3d))
* **repoServices:** fixed a bug, where error is not corretly thrown ([6051a65](https://github.com/hjmosedk/eCommerceAPI/commits/6051a6500c7746ec8609f75d8ebabd9d1690ee04)), closes [#24](https://github.com/hjmosedk/eCommerceAPI/issues/24) [#24](https://github.com/hjmosedk/eCommerceAPI/issues/24)


### Minor Changes

* **app:** house keeping [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5) ([8ebd72b](https://github.com/hjmosedk/eCommerceAPI/commits/8ebd72be22f075f70de290f85458e2103328d0d9))
* **deps:** removed types-handlebars as it is depicated ([1f23733](https://github.com/hjmosedk/eCommerceAPI/commits/1f237335e802052832454c6136ea963ff6951dff))
* **deps:** updated all depencies ([db46045](https://github.com/hjmosedk/eCommerceAPI/commits/db460453c72205cf1c90a39d805064173b988404))
* **deps:** updated all depencies ([e8df0f1](https://github.com/hjmosedk/eCommerceAPI/commits/e8df0f11d1b2168e2be0ed639206f1dd966cbe81))
* **deps:** updated all dependencies ([46b1a26](https://github.com/hjmosedk/eCommerceAPI/commits/46b1a26a50db6c13ca690e849442db360deb369e))
* **deps:** updated all dependencies ([a062f42](https://github.com/hjmosedk/eCommerceAPI/commits/a062f426cde87ecec310f00d5f40d70e2cc18472))
* **deps:** updated all dependencies ([0a9d9de](https://github.com/hjmosedk/eCommerceAPI/commits/0a9d9defac315b6cac24f76933591c0cf8bb0a63))
* **deps:** updated all dependencies ([05909d0](https://github.com/hjmosedk/eCommerceAPI/commits/05909d0110a3a555636c9cc593062acc1d556ee6))
* **deps:** updated all deps ([1bd6db5](https://github.com/hjmosedk/eCommerceAPI/commits/1bd6db50da5f4318136313d923e7f01de0166c70))
* **deps:** updated all deps ([d5261d9](https://github.com/hjmosedk/eCommerceAPI/commits/d5261d94c6e4a00da6e441ec9ca52370e748a53a))
* **deps:** updated all deps ([cc4f3c8](https://github.com/hjmosedk/eCommerceAPI/commits/cc4f3c8259eca11f58197ec6c73a032d361c60ec)), closes [#22](https://github.com/hjmosedk/eCommerceAPI/issues/22)
* **deps:** updated all deps ([e0119eb](https://github.com/hjmosedk/eCommerceAPI/commits/e0119ebef119cccf44de851ef47ba73522c10cdc)), closes [#3](https://github.com/hjmosedk/eCommerceAPI/issues/3)
* **deps:** updated all deps ([c545a8a](https://github.com/hjmosedk/eCommerceAPI/commits/c545a8a1b0a56c178f6b045c170c379cfb5f2298))
* **deps:** updated all deps ([790fe22](https://github.com/hjmosedk/eCommerceAPI/commits/790fe222d4ada3631e13d8ea83e7764ca5944eab))
* **deps:** updated all deps ([2a7f20f](https://github.com/hjmosedk/eCommerceAPI/commits/2a7f20f5231aeee679b1991021db9d35059d8c95))
* **deps:** updated all deps ([4771c9d](https://github.com/hjmosedk/eCommerceAPI/commits/4771c9d0ccd1d10e15c28b87b052aff000292d1a))
* **deps:** updated all deps ([bce9eca](https://github.com/hjmosedk/eCommerceAPI/commits/bce9ecaedf420560f6eb03fb97cfb095f88b109d))
* **deps:** updated all deps ([5a7c04d](https://github.com/hjmosedk/eCommerceAPI/commits/5a7c04d1827faf2226966e75f41dd27e6a74b881))
* **deps:** updated all deps ([54ad7a3](https://github.com/hjmosedk/eCommerceAPI/commits/54ad7a3a6db3fb6c2fb881705745b4c62639a366))
* **deps:** updated all deps ([67c95cb](https://github.com/hjmosedk/eCommerceAPI/commits/67c95cb0f41ad23963d99b53ff0624b9dde84d55))
* **deps:** updated all deps ([aa75a4e](https://github.com/hjmosedk/eCommerceAPI/commits/aa75a4e9539f600992f971f91e7b10a0ca2b72af))
* **deps:** updated all deps ([82e01e1](https://github.com/hjmosedk/eCommerceAPI/commits/82e01e19c27dd0ad6dddd2d95895cfeda0ea65bf))
* **deps:** updated alle deps ([64a6f95](https://github.com/hjmosedk/eCommerceAPI/commits/64a6f9506b4810b52211bce2a0e3be72b981695f))
* **deps:** updated deps ([04076cc](https://github.com/hjmosedk/eCommerceAPI/commits/04076cc40db2d1a21e7ad959565a78e07f361e3a))
* **deps:** updated deps ([2a3e551](https://github.com/hjmosedk/eCommerceAPI/commits/2a3e5516f2e113d64d50bc42f0b5875b0f6e7490))
* **deps:** updated deps [#9](https://github.com/hjmosedk/eCommerceAPI/issues/9) ([65f2d38](https://github.com/hjmosedk/eCommerceAPI/commits/65f2d38ee2ca67be7caa03ce3bedc6465400422d))
* **deps:** updates all deps resolves [#13](https://github.com/hjmosedk/eCommerceAPI/issues/13) ([9403c9e](https://github.com/hjmosedk/eCommerceAPI/commits/9403c9e66ce24c852abaa12108c7f3af03c3456a))
* **husky:** updated the husky conf, to newest version ([72d8948](https://github.com/hjmosedk/eCommerceAPI/commits/72d8948381230f1cff7a3118f950cd9a1ccf129d))
* **messaging:** implements [#6](https://github.com/hjmosedk/eCommerceAPI/issues/6) ([96fdb97](https://github.com/hjmosedk/eCommerceAPI/commits/96fdb97a6c13e0a77e330c3dc08524125ace0530))
* **newOrder.dto:** removed paymentMethodId, as it is no longer needed ([2c216e7](https://github.com/hjmosedk/eCommerceAPI/commits/2c216e7bd228c851ce9cebb867fea02b1ba6da94))
* **productsModuleTest:** did some clean up on the test ([f70d03f](https://github.com/hjmosedk/eCommerceAPI/commits/f70d03f00836b5f4d4313faa502b9709cf2f612c)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **ts:** updated typescript ([1440563](https://github.com/hjmosedk/eCommerceAPI/commits/1440563143610e173136012aceab2f8eb176f46e))


### Documentation

* **readme:** updated the readme with additional information ([c273215](https://github.com/hjmosedk/eCommerceAPI/commits/c273215c8a00f86748a60b4d113da4fb3996d3e6)), closes [#21](https://github.com/hjmosedk/eCommerceAPI/issues/21)


### Optimizations

* **all:** code refactored to account for centerlized typings ([8fc747d](https://github.com/hjmosedk/eCommerceAPI/commits/8fc747d16b95c16fa29d58fe20dad23ca3f4a588))
* **createOrder:** create new order refactored to use query runner ([c6eace7](https://github.com/hjmosedk/eCommerceAPI/commits/c6eace7cc4922b99ec4d5c0c851cf279db7b9fb0))
* **orderService:** restrutured orderService ([6200f27](https://github.com/hjmosedk/eCommerceAPI/commits/6200f27b37c190d3fb032cabbb45d72659455b68))


### Test

* **all:** reorganized tests following centralizing typings ([842f049](https://github.com/hjmosedk/eCommerceAPI/commits/842f049a3d7b423d38eb26d6774d0528ebe76418))
* **e2e-order:** temporary workaroud added for the email bug ([4912662](https://github.com/hjmosedk/eCommerceAPI/commits/491266252cd1d9a33d992f8d1f1580fed877f46f))
* **orderController:** order controller have been updated ([2ec4fa6](https://github.com/hjmosedk/eCommerceAPI/commits/2ec4fa60065e4e646bd4f4848cd272a339a22478)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **orderController:** updated test for orders ([46f8bdf](https://github.com/hjmosedk/eCommerceAPI/commits/46f8bdfdda8104fe7c4b5274be4b767fc4ac7a08)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **orders:** all orders test have been adjusted ([cf1b88e](https://github.com/hjmosedk/eCommerceAPI/commits/cf1b88ef787f59baab73ad201e696fec2980444b)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **orderService:** adjusted test to account for updated orderService ([9704d31](https://github.com/hjmosedk/eCommerceAPI/commits/9704d31f13c9be1b3e87f425d16d0b06f1b5d66f))
* **orderService:** updated the order service test ([1e00a6d](https://github.com/hjmosedk/eCommerceAPI/commits/1e00a6d04810061d8c5a1ee5d307070757287e3d)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **product-int:** update the integration test for products ([c22aea6](https://github.com/hjmosedk/eCommerceAPI/commits/c22aea632fd1e2b75dc7e537dfbe1bc6b3a19392)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **productsModule:** products module tests have been adjusted ([539b89c](https://github.com/hjmosedk/eCommerceAPI/commits/539b89c40d38546a671f516d68f6c635141b5624)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **test:** adjusted and updated all test [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5) ([6a66d57](https://github.com/hjmosedk/eCommerceAPI/commits/6a66d579d66ad78a848032384d9b6dae09ee91e5))
* **test:** fixed a small bug in the test ([4c0610a](https://github.com/hjmosedk/eCommerceAPI/commits/4c0610a201a6bfa9395f0fecb8a7d35d1bc43b40)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **unitTest:** all relevant unit test added ([2fc4d78](https://github.com/hjmosedk/eCommerceAPI/commits/2fc4d785ae60a0a71d4af425f11112c2bb6d820a)), closes [#5](https://github.com/hjmosedk/eCommerceAPI/issues/5)
* **updatedConfig:** configs update to include coverage ([a9b9bdd](https://github.com/hjmosedk/eCommerceAPI/commits/a9b9bdd3560c2053babbef0529bf60fc34ec6c30))

## [0.5.1](https://github.com/hjmosedk/eCommerceAPI/compare/v0.5.0...v0.5.1) (2024-04-01)


### Minor Changes

* **deps:** updated all deps ([857d180](https://github.com/hjmosedk/eCommerceAPI/commits/857d1809cb753a0058dd490da6bd24dbced4fc45))


### Documentation

* **versioning:** added more info to changelog ([7be7675](https://github.com/hjmosedk/eCommerceAPI/commits/7be767599e8f696cb5c8b8cb16011dd7c80733a8))

## [0.5.0](https://github.com/hjmosedk/eCommerceAPI/compare/v0.4.0...v0.5.0) (2024-04-01)


### Test

* **ordere2e:** fixed a small bug in the test ([05380c8](https://github.com/hjmosedk/eCommerceAPI/commits/05380c84087645d50b6a06fdcd0977ae069010d0))

## [0.4.0](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.3.3...v0.4.0) (2024-04-01)

### [0.3.3](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.3.2...v0.3.3) (2024-03-22)


### Documentation

* **package.json:** added signature to version ([06bace4](https://codeberg.org/hjmosedk/eCommerceAPI/commits/06bace42519cf0f20fb9cb67884d14dcab8dc19f))

### [0.3.2](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.3.1...v0.3.2) (2024-03-21)

### [0.3.1](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.3.0...v0.3.1) (2024-02-15)


### Documentation

* **readme:** updated the readme to to reflect current nodeversion ([d1caf39](https://codeberg.org/hjmosedk/eCommerceAPI/commits/d1caf39af2e9d1e359b66041f697ab4ae087a177))

## [0.3.0](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.2.0...v0.3.0) (2024-02-15)


### Features

* **errorhandling:** refined global error handling ([83246ce](https://codeberg.org/hjmosedk/eCommerceAPI/commits/83246ce8dd309f51456f0b73f865b241f89cf117))
* **orders:** the basic features of the order module is now implemented ([bafdca8](https://codeberg.org/hjmosedk/eCommerceAPI/commits/bafdca828265fea454096c55dccedc63795be2d6))


### Bug Fixes

* **orderController:** fixed a bug in the name of the method ([4bb49e1](https://codeberg.org/hjmosedk/eCommerceAPI/commits/4bb49e18f4a1001500b59becc1a30c529c0c8e06))
* **productDTO:** fixed the dto, it now accepts booleans in isPublic ([e51d669](https://codeberg.org/hjmosedk/eCommerceAPI/commits/e51d669edde037a1f6827bfc21e0205c0a9c429a))
* **test:** fixed a bug in the tests, they should now all pass ([e18d924](https://codeberg.org/hjmosedk/eCommerceAPI/commits/e18d92424a02fa817cab477627093252d0c55c08))


### Documentation

* **dtos:** adjusted DTOs for swagger, and updated the documnentation for these ([448bf23](https://codeberg.org/hjmosedk/eCommerceAPI/commits/448bf233f9015215fe5e9a9c10c03f15d069b1a0))


### Test

* **orderController:** the test suite for order controller is now completed ([06a44e1](https://codeberg.org/hjmosedk/eCommerceAPI/commits/06a44e1e4d37b7d0da0cb0b82d2d26e44fa7a8c0))
* **OrderService:** added the order service test to the test battery ([d9cbac8](https://codeberg.org/hjmosedk/eCommerceAPI/commits/d9cbac8b1586c8ad0f9dd1dbf01597a1aa0b3c02))
* **orderService:** adjusted code and test to account for save instead of update ([3288515](https://codeberg.org/hjmosedk/eCommerceAPI/commits/3288515d9ff64032861d579bbc3676ffe44d1d3d))
* **orders:** moved the test to align with other tests ([8e3f282](https://codeberg.org/hjmosedk/eCommerceAPI/commits/8e3f2828e882288b49c339e1d494135fc4ac2b64))
* **orders:** order end2end test now implemented ([58a4892](https://codeberg.org/hjmosedk/eCommerceAPI/commits/58a48921e384cb23492541b34d19acfcf63bebb5))

## [0.2.0](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.1.0...v0.2.0) (2023-09-20)


### ⚠ BREAKING CHANGES

* **activeProduct:** /products have changed behavour

### Features

* **activeProduct:** the API can now sort on products, if they are active or if they are on stock ([7fb29c5](https://codeberg.org/hjmosedk/eCommerceAPI/commits/7fb29c5a844aa43cea63394c05bc743f49be3397))
* **isPublic:** status can now be changed by the API ([fcbfd32](https://codeberg.org/hjmosedk/eCommerceAPI/commits/fcbfd3258c24f10f25bb1c166186d141145c8e1b))


### Test

* **e2e:** added support for e2e test via the frontend ([4804ce9](https://codeberg.org/hjmosedk/eCommerceAPI/commits/4804ce9763a758904f65acbefc0923717ba8f86d))
* **products:** updated test to account for new isPublic property ([1835e8d](https://codeberg.org/hjmosedk/eCommerceAPI/commits/1835e8d05b59430462f30eef4179204a1bef23a6))

## [0.1.0](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.0.3...v0.1.0) (2023-08-22)


### Bug Fixes

* **productsService:** fixed typo in error message ([51a65a8](https://codeberg.org/hjmosedk/eCommerceAPI/commits/51a65a85ad163c218cf34c56a814cd43fff4c71c))
* **updateProduct:** fixed a bug with the upload functionallity ([de69ac7](https://codeberg.org/hjmosedk/eCommerceAPI/commits/de69ac75db7d92f751c8feb10f0bbc10694e8709))


### Test

* **all:** adjusted all test, and moved them to src - Test comments for coverages files ([d1ef217](https://codeberg.org/hjmosedk/eCommerceAPI/commits/d1ef217807f5276622a107f292bef4225b99ac4c))
* **coverage:** added comments in all files for wht they are excluded from test coverage ([57ae069](https://codeberg.org/hjmosedk/eCommerceAPI/commits/57ae069a42f42f71165cc42c7482ce2f8aa609f0))
* **e2e-Products:** updated and adjusted the e2e test for products ([be17868](https://codeberg.org/hjmosedk/eCommerceAPI/commits/be17868d0a407af1aa7f7b8149f9a9c431524915))
* **imageUpload:** adjusted the test to work as expeced and to ensure proper testing ([8fc83c0](https://codeberg.org/hjmosedk/eCommerceAPI/commits/8fc83c01809e0ef619d7216a189abe642091f9b0))
* **productsController:** adjusted tests to works as expected, and to ensure proper testing ([77fc6a3](https://codeberg.org/hjmosedk/eCommerceAPI/commits/77fc6a391144be7a8e24943282186c0a2f33bbeb))
* **productService:** updated and adjusted product service test ([9b3fcfe](https://codeberg.org/hjmosedk/eCommerceAPI/commits/9b3fcfe9e70b2ce554844d6dbb722206db0e4bfc))
* **productsService:** adjusted test to ensure better coverage ([6f7e202](https://codeberg.org/hjmosedk/eCommerceAPI/commits/6f7e202d42a6ccffe14e12b785686d24d39b56ee))

### [0.0.3](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.0.2...v0.0.3) (2023-08-02)

### ⚠ BREAKING CHANGES

- **upload:** images endpoint changed to /images/upload from /images/:id

### Features

- **error:** adjusted error message, for sku change, sku cannot be changed ([dc84139](https://codeberg.org/hjmosedk/eCommerceAPI/commits/dc8413964c133d4c0041e7c694f765a97e0db1d2))
- **productImg:** the backend now supports upload and collection of images ([e182082](https://codeberg.org/hjmosedk/eCommerceAPI/commits/e1820827681bceb02f87822cbca4e48782f4b6e7))
- **product:** patch added to update products ([7240aa0](https://codeberg.org/hjmosedk/eCommerceAPI/commits/7240aa0066dc13903b6a07f12a63a385072ec5ce))
- **products:** added service to add several products at the same time ([c237a38](https://codeberg.org/hjmosedk/eCommerceAPI/commits/c237a388fee44729883fad2c7a58a72504d929ee))
- **upload:** the upload functionality where recoded to be in a seperate module ([872a620](https://codeberg.org/hjmosedk/eCommerceAPI/commits/872a6200b9867ddd5b5fba8f55fb7b82bef09366))

### Bug Fixes

- **products:** added an error to get all products if database is empty ([688be22](https://codeberg.org/hjmosedk/eCommerceAPI/commits/688be22bad666feb40bc6af1849c4fe085e7e94c))
- **swagger:** fixed swagger and the product is now ready for a new minor version ([7ed8825](https://codeberg.org/hjmosedk/eCommerceAPI/commits/7ed882514c3e1525f8cbe4c5961fdcb19a466872))

### Test

- **products:** adjusted e2e test to test something meaningfull ([381d234](https://codeberg.org/hjmosedk/eCommerceAPI/commits/381d234f8e38f0b568fd101cc2550999ccd3c770))
- **products:** refactored test for better strucutre, and to prepare for new update tests ([3e46e9b](https://codeberg.org/hjmosedk/eCommerceAPI/commits/3e46e9bb41ec850386e53028b8925820b222ce2f))
- **products:** updated all test, to ensure full coverage ([1e6e44e](https://codeberg.org/hjmosedk/eCommerceAPI/commits/1e6e44ebdfdee971031382f118bcba3ee491b185))

### [0.0.2](https://codeberg.org/hjmosedk/eCommerceAPI/compare/v0.0.1...v0.0.2) (2023-02-22)

### Features

- added the ability to create products ([c0a2e1f](https://codeberg.org/hjmosedk/eCommerceAPI/commits/c0a2e1f24ed3fa200b581f7013e04c857820da99))
- first version of the products module have been implemented ([a470684](https://codeberg.org/hjmosedk/eCommerceAPI/commits/a47068485f94eb8ef8b080f1a3b15a103a7c8f2b))
- get one product have been implemented ([ce7bcbb](https://codeberg.org/hjmosedk/eCommerceAPI/commits/ce7bcbb1303b97855cc6d21eb8934be9c74f7d41))

### Bug Fixes

- fixed CORS ([20d9432](https://codeberg.org/hjmosedk/eCommerceAPI/commits/20d94323011089d5250763563887328584138dbf))

### Documentation

- updated the codes to fit swagger style ([93d8abf](https://codeberg.org/hjmosedk/eCommerceAPI/commits/93d8abf015a3421eba9aa15df0a0339166dbaa3e))

### 0.0.1 (2022-10-05)

### Features

- initial feature commit b0a7a27
