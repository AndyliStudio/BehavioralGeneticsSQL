// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('AuthLoginController', ['$scope', 'AuthService', '$state', '$location',
    function ($scope, AuthService, $state, $location) {
      $scope.user = {
        email: 'andyliwr@outlook.com',
        password: '123456'
      };

      $scope.login = function () {
        AuthService.login($scope.user.email, $scope.user.password)
          .then(function () {
            // $state.go('main');
            var next = $location.nextAfterLogin || '/main';
            $location.nextAfterLogin = null;
            $location.path(next);
          }).catch(function (err) {
            alert('用户名或者密码错误');
          });
      };
    }
  ])
  .controller('AuthLogoutController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      AuthService.logout()
        .then(function () {
          $state.go('all-reviews');
        });
    }
  ])
  .controller('SignUpController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      $scope.user = {
        email: '',
        username: '',
        password: '',
        comfimPassword: '',
        organization: '',
        country: '',
      };

      $scope.register = function () {
        AuthService.register($scope.user.email, $scope.user.password)
          .then(function () {
            $state.transitionTo('sign-up-success');
          });
      };
    }
  ])
  .controller('MarkerController', ['$scope', 'Snp_info', '$state',
    function ($scope, Snp_info, $state) {
      $scope.sstr = ''
      $scope.suggests = []
      $scope.thisMarker = {}
      $scope.isShowTable = false
      $scope.isShowSuggest = false
      $scope.searchMarker = function () {
        $scope.isShowSuggest = true
        Snp_info.find({
          filter: {
            where: {
              marker: {
                like: "%" + $scope.sstr + "%"
              }
            },
            fields: {
              marker: true,
              id: true
            }
          }
        })
          .$promise
          .then(function (res) {
            if (res instanceof Array) {
              res.forEach(item => {
                if ($scope.suggests.length < 10) {
                  $scope.suggests.push({
                    id: item.id,
                    text: item.marker
                  })
                }
              })
            }
          })
      };
      $scope.showMarker = function (id, marker) {
        $scope.sstr = marker
        Snp_info.find({
          filter: {
            where: {
              id: id
            }
          }
        })
          .$promise
          .then(function (res) {
            $scope.isShowSuggest = false
            $scope.isShowTable = true
            $scope.thisMarker = res[0]
          })
      };
    }
  ])
  .controller('PhenotypeController', ['$scope', 'Snp_info', '$state', '$http',
    function ($scope, Snp_info, $state, $http) {
      $scope.sstr = ''
      $scope.pValue = '0.00000008942450418520821'
      $scope.suggests = []
      $scope.allSnps = []
      $scope.showingSnps = []
      $scope.isShowTable = false
      $scope.isShowSuggest = false
      $scope.currentPage = 0
      $scope.totalItems = 0
      $scope.isSelectAll = false
      $scope.selectIds = []
      $scope.download_fail_text = ''
      $scope.convertFloat = function (str) {
        let regExp = /^\d+(\.)*\d+[Ee]{1}(-)*\d+$/ig
        if (regExp.test(str)) {
          let num = parseFloat(str.substring(0, str.indexOf('e') > -1 ? str.indexOf('e') : (str.indexOf('E') > -1 ? str.indexOf('E') : 0)))
          let exc = parseInt(str.substring((str.indexOf('e') > -1 ? str.indexOf('e') : (str.indexOf('E') > -1 ? str.indexOf('E') : 0)) + 1))
          return num * Math.pow(10, exc)
        } else {
          return parseFloat(str)
        }
      }
      $scope.searchTrait = function () {
        $scope.isShowSuggest = true
        Snp_info.find({
          filter: {
            where: {
              trait: {
                like: "%" + $scope.sstr + "%"
              }
            },
            fields: {
              trait: true
            }
          }
        })
          .$promise
          .then(function (res) {
            if (res instanceof Array) {
              res.forEach(item => {
                // 判断item.trait是不是在suggests中存在，不存在则添加
                let hasExist = $scope.suggests.some(suggest => {
                  return suggest === item.trait
                })
                if (!hasExist) {
                  $scope.suggests.push(item.trait)
                }
              })
            }
          })
      }
      $scope.showTrait = function (trait) {
        $scope.sstr = trait
        Snp_info.find({
          filter: {
            where: {
              trait: trait,
              p: {
                gte: $scope.convertFloat($scope.pValue.toString())
              }
            }
          }
        })
          .$promise
          .then(function (res) {
            $scope.isShowSuggest = false
            $scope.isShowTable = true
            $scope.totalItems = res.length || 0
            $scope.showingSnps = res.splice(0, 10).map(item => {
              item.isChecked = false
              return item;
            })
            $scope.allSnps = res.map(item => {
              item.isChecked = false
              return item;
            })
          })
      }
      $scope.pageChanged = function () {
        $scope.showingSnps = $scope.allSnps.splice($scope.currentPage * 10, 10)
      }
      $scope.itemSelected = function (select, id) {
        let isExist = $scope.selectIds.some(item => {
          return item === id
        })
        if (select) {
          if (!isExist) {
            $scope.selectIds.push(id)
          }
        } else {
          if (!isExist) {
            $scope.selectIds.splice($scope.selectIds.indexOf(id), 1)
          }
        }
      }
      $scope.selectAll = function () {
        $scope.selectIds = []
        if ($scope.isSelectAll) {
          $scope.allSnps.forEach(item => {
            item.isChecked = true
            $scope.selectIds.push(item.id)
          })
        } else {
          $scope.allSnps.forEach(item => {
            item.isChecked = false
          })
        }
        $scope.showingSnps = $scope.allSnps.splice($scope.currentPage * 10, 10)
      }
      $scope.download = function () {
        // 获取所有选中的snpinfo的id
        $http({
          method: 'post',
          url: '/api/snp_infos/downloadSnp',
          data: {
            ids: $scope.selectIds
          }
        }).then(function successCallback(response) {
          if (response.data.result.errno === 0) {
            window.open(response.data.result.download_url)
          } else {
            $scope.download_fail_text = '下载失败，' + response.data.result.message
          }
        }, function errorCallback(error) {
          $scope.download_fail_text = '下载失败，' + error.toString()
        });
      }
    }
  ])
  .controller('ContactUsController', ['$rootScope', '$scope', 'NgMap', '$http',
    function ($rootScope, $scope, NgMap, $http) {
      $scope.isShowWindowInfo = false
      NgMap.getMap().then(function (map) {
        $scope.map = map;
      })
      $scope.clicked = function () {
        window.open('https://goo.gl/maps/LYLtGWPo1ED2')
      }
      $scope.isDoSubmit = false // 
      $scope.isFinishSubmit = false // 是否完成提交请求的发送
      $scope.isSubmitSuccess = false // 是否提交反馈成功
      $scope.alert = { isShow: false, type: '', message: '', animate: 'out' } // 警告提示
      $scope.closeAlert = function () {
        $scope.alert = { isShow: false, type: '', message: '', animate: 'out' } // 警告提示
      }
      $scope.shops = [{
        id: '西南大学（SourthWest University）',
        address: '中国重庆市北碚区天生丽街西南大学25教学楼',
        english_addr: 'Chian Chongqing Beibei Tiansheng SourthWest University',
        postnum: '400715',
        tel: '18883339779',
        position: [29.820065, 106.424587]
      }]
      $scope.shop = $scope.shops[0]

      $scope.showDetail = function (e, shop) {
        if ($scope.isShowWindowInfo) {
          $scope.map.hideInfoWindow('foo-iw');
        } else {
          $scope.shop = shop;
          $scope.map.showInfoWindow('foo-iw', shop.id);
        }
        $scope.isShowWindowInfo = !$scope.isShowWindowInfo
      }
      $scope.contactForm = { name: '', email: '', tel: '', message: '' }
      $scope.submit = function () {
        if (!$scope.contactForm.name || !$scope.contactForm.email || !$scope.contactForm.message) {
          return
        } else {
          $scope.isDoSubmit = true
          $http({
            method: 'post',
            url: '/api/users/contactUs',
            data: $scope.contactForm,
          }).then(function successCallback(response) {
            $scope.isDoSubmit = false
            $scope.isFinishSubmit = true
            if (response.data.result.code === 0) {
              $scope.isSubmitSuccess = true
              $scope.alert = { isShow: true, type: 'success', message: '发送反馈成功！', animate: 'enter' } // 警告提示
            } else {
              $scope.alert = { isShow: true, type: 'error', message: '发送反馈失败！' + response.data.result.message, animate: 'out' } // 警告提示
            }
          }, function errorCallback(error) {
            $scope.alert = { isShow: true, type: 'error', message: '发送反馈失败！' + error.toString(), animate: 'out' } // 警告提示
          });
        }
      }
    }
  ])
  .controller('TeamController', ['$scope', '$state',
    function ($scope, $state) {
    }
  ])
  .controller('PathwayController', ['$scope', 'Snp_info', 'Gene_info', 'Pathway', '$state',
    function ($scope, Snp_info, Gene_info, Pathway, $state) {
      $scope.sstr = ''
      $scope.suggests = []
      $scope.thisPathway = {}
      $scope.isShowTable = false
      $scope.isShowSuggest = false // wheather show suggest panel
      $scope.showLoading = false // wheather show loading panel
      $scope.chartData = []
      $scope.timer = null
      $scope.searchPathway = function () {
        if($scope.sstr){
          $scope.isShowSuggest = true
          Pathway.find({
            filter: {
              where: {
                pathway: {
                  like: "%" + $scope.sstr + "%"
                }
              },
              fields: {
                pathway: true,
                genes: true,
                id: true
              }
            }
          })
            .$promise
            .then(function (res) {
              if (res instanceof Array) {
                res.forEach(item => {
                  if ($scope.suggests.length < 10) {
                    $scope.suggests.push({
                      id: item.id,
                      text: item.pathway,
                      genes: item.genes
                    })
                  }
                })
              }
            })
        }else{
          $scope.isShowSuggest = false
        }
      };
      $scope.showPathway = function (text, id, genes) {
        var self = $scope
        $scope.sstr = text
        $scope.chartData = []
        // close search suggest
        $scope.isShowSuggest = false
        $scope.showLoading = true
        $scope.isShowTable = false
        // 遍历所有的genes
        genes.forEach((item, index) => {
          $scope.chartData.push({sign: '', result: [], name: item, range: '', length: 0})
          Gene_info.find({
            filter: {
              where: {
                gene_id: item
              },
              fields: {
                start: true,
                stop: true
              },
              limit: 1
            }
          })
            .$promise
            .then(function (res) {
              if(res instanceof Array && res.length > 0){
                // find all snps where pos bettwen start_pos and end_pos
                self.chartData[index].range = '['+res[0].start+','+res[0].stop+']'
                Snp_info.find({
                  filter: {
                    where: {
                      pos: {
                        between: [parseInt(res[0].start), parseInt(res[0].stop)]
                      }
                    },
                    fields: {
                      id: true,
                      pos: true
                    }
                  }
                })
                  .$promise
                  .then(function (snpRes){
                    if(snpRes){
                      self.chartData[index].sign = 'success'
                      self.chartData[index].result = snpRes
                      self.chartData[index].length = snpRes.length
                    }else{
                      self.chartData[index].sign = 'fail'
                    }
                  })
              }else{
                self.chartData[index].sign = 'fail'
                console.log("can't found such gene_info where gene_id is " + item)
              }
            })
        })
        self.timer = setInterval(function(){
          var that = $scope
          var isAllReady = $scope.chartData.every(item => {
            return item.sign === 'success' || item.sign === 'fail'
          })
          var str = ''
          $scope.chartData.forEach(item => {
            str += '('+item.sign + ') '
          })
          console.log(str)
          if(isAllReady){
            that.isShowSuggest = false
            that.showLoading = false
            that.isShowTable = true
            that.$apply();//需要手动刷新 
            clearInterval(that.timer)
          }
        }, 100)
      };
      var count = 0;
      $scope.displayFunction = function () {
          count++;
          return count+ ' ' +this.name;
      };

      $scope.tootipFunction = function () {
          var color = "style=\"color: "+this.series.color+"\"";
          return  "<span "+color+">基因名字："+ this.x +"</span><br>"+"<span "+color+">"+"包含的显著snp个数："+": </span> <b>"+this.point.y+"</b><br><span>显著snp位置区间：<b>"+this.point.range+"</b></span>"
      };
    }
  ])
  .controller('Gene_regionController', ['$scope', 'Snp_info', 'Gene_info', 'Pathway', '$state', '$http',
    function ($scope, Snp_info, Gene_info, Pathway, $state, $http) {
      $scope.sstr = ''
      $scope.suggests = []
      $scope.thisPathway = {}
      $scope.isShowTable = false
      $scope.isShowSuggest = false // wheather show suggest panel
      $scope.showLoading = false // wheather show loading panel
      $scope.allSnps = []
      $scope.showingSnps = []
      $scope.currentPage = 0
      $scope.totalItems = 0
      $scope.isSelectAll = false
      $scope.selectIds = []
      $scope.download_fail_text = ''
      $scope.convertFloat = function (str) {
        let regExp = /^\d+(\.)*\d+[Ee]{1}(-)*\d+$/ig
        if (regExp.test(str)) {
          let num = parseFloat(str.substring(0, str.indexOf('e') > -1 ? str.indexOf('e') : (str.indexOf('E') > -1 ? str.indexOf('E') : 0)))
          let exc = parseInt(str.substring((str.indexOf('e') > -1 ? str.indexOf('e') : (str.indexOf('E') > -1 ? str.indexOf('E') : 0)) + 1))
          return num * Math.pow(10, exc)
        } else {
          return parseFloat(str)
        }
      }
      $scope.searchGeneRegion = function () {
        if($scope.sstr){
          $scope.isShowSuggest = true
          $scope.showLoading = true
          Gene_info.find({
            filter: {
              where: {
                gene_id: {
                  like: "%" + $scope.sstr + "%"
                }
              },
              fields: {
                start: true,
                stop: true,
                gene_id: true,
                id: true
              }
            }
          })
            .$promise
            .then(function (res) {
              if (res instanceof Array) {
                res.forEach(item => {
                  if ($scope.suggests.length < 10) {
                    $scope.suggests.push({
                      id: item.id,
                      gene_id: item.gene_id,
                      start: item.start,
                      stop: item.stop
                    })
                  }
                })
              }
              $scope.showLoading = false
            })
        }else{
          $scope.isShowSuggest = false
          $scope.showLoading = false
        }
      };
      $scope.showGeneRegion = function (gene_id, start, stop) {
        var self = $scope
        $scope.sstr = gene_id
        
        // close search suggest
        $scope.isShowSuggest = false
        $scope.showLoading = true
        $scope.isShowTable = false
        // search snp_info
        Snp_info.find({
          filter: {
            where: {
              pos: {  
                between: [parseInt(start), parseInt(stop)]
                // between: [75804327, 85857943]
              }
            },
            fields: {
              id: true,
              trait: true,
              marker: true,
              pos: true
            }
          }
        })
          .$promise
          .then(function (snpRes){
            if(snpRes){
              $scope.isShowSuggest = false
              $scope.showLoading = false
              $scope.isShowTable = true
              $scope.totalItems = snpRes.length || 0
              $scope.showingSnps = snpRes.splice(0, 10).map(item => {
                item.isChecked = false
                return item;
              })
              $scope.allSnps = snpRes.map(item => {
                item.isChecked = false
                return item;
              })
            }
          })
      };
      $scope.pageChanged = function () {
        $scope.showingSnps = $scope.allSnps.splice($scope.currentPage * 10, 10)
      }
      $scope.itemSelected = function (select, id) {
        let isExist = $scope.selectIds.some(item => {
          return item === id
        })
        if (select) {
          if (!isExist) {
            $scope.selectIds.push(id)
          }
        } else {
          if (!isExist) {
            $scope.selectIds.splice($scope.selectIds.indexOf(id), 1)
          }
        }
      }
      $scope.selectAll = function () {
        $scope.selectIds = []
        if ($scope.isSelectAll) {
          $scope.allSnps.forEach(item => {
            item.isChecked = true
            $scope.selectIds.push(item.id)
          })
        } else {
          $scope.allSnps.forEach(item => {
            item.isChecked = false
          })
        }
        $scope.showingSnps = $scope.allSnps.splice($scope.currentPage * 10, 10)
      }
      $scope.download = function () {
        // 获取所有选中的snpinfo的id
        $http({
          method: 'post',
          url: '/api/snp_infos/downloadSnp',
          data: {
            ids: $scope.selectIds
          }
        }).then(function successCallback(response) {
          if (response.data.result.errno === 0) {
            $('body').append('<a href="response.data.result.download_url" id="gotoDownload"></a>')
            $('#gotoDownload').click(function(event){
              event.preventDefault()
              window.open(response.data.result.download_url)
            })
            $('#gotoDownload').trigger('click')
            // window.open(response.data.result.download_url)
          } else {
            $scope.download_fail_text = '下载失败，' + response.data.result.message
          }
        }, function errorCallback(error) {
          $scope.download_fail_text = '下载失败，' + error.toString()
        });
      }
    }
  ]);