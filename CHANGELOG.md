# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
