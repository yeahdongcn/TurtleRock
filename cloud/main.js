// 计算总资产
AV.Cloud.define('calculateTotalAssets', function(request, response) {
	response.success('TotalAssets');
});

// Array是否包含元素
Array.prototype.contain = function(obj) {
    return this.indexOf(obj) !== -1;
}

AV.Cloud.define('export', function(request, response) {
	AV.Cloud.run('getTheBalanceSheetStructure', null, {
		success: function(data){
			response.success(data);
		},
  		error: function(err){
  			response.error(err)
  		}
	});
});

// 资产负债表对应的excel结构
AV.Cloud.define('getTheBalanceSheetStructure', function(request, response) {
	var structure = {'title': '资产负债表',
	'numberOfColumns': 4,
	'numberOfRows': 34,
	'rows': [
	// 0
	['项目', '附注', '期末数据', '期初数据', '', '', ''],

    // 1
	['流动资产：', '', '', '', '', '', ''],

    // 2
	['货币资金', '', '', '', '', ['现金', '银行存款', '其他货币资金'], []],
	['交易性金融资产', '', '', '', '', ['交易性金融资产'], []],
	['应收票据', '', '', '', '', ['应收票据'], []],
	['应收账款', '', '', '', '', ['应收账款'], ['应收账款坏账准备']],
	['预付款项', '', '', '', '', ['预付款项'], []],
	['应收利息', '', '', '', '', ['应收利息'], []],
	['应收股利', '', '', '', '', ['应收股利'], []],
	['其他应收款', '', '', '', '', ['其他应收账款'], ['其他应收账款坏账准备']],
	['存货', '', '', '', '', '', ['存货'], ['存货跌价准备']],
	['一年内到账的非流动资产', '', '', '', '', '', ['一年内到账的非流动资产'], []],
	['其他流动资产', '', '', '', '', ['其他流动资产'], []],

	// 13
	['流动资产合计', '', '', '', '', '', ''],

	// 14
	['非流动资产：', '', '', '', '', '', ''],

    // 15
	['可供出售金融资产', '', '', '', '', ['可供出售金融资产'], []],
	['持有至到期投资', '', '', '', '', ['持有至到期投资'], []],
	['长期应收款', '', '', '', '', ['长期应收款'], []],
	['长期期权投资', '', '', '', '', ['长期期权投资'], []],
	['长期性房地产', '', '', '', '', ['长期性房地产'], []],
	['固定资产', '', '', '', '', ['固定资产原值'], ['累计折旧']],
	['在建工程', '', '', '', '', ['在建工程'], []],
	['工程物资', '', '', '', '', ['工程物资'], []],
	['固定资产清理', '', '', '', '', ['固定资产清理'], []],
	['生产性生产物资', '', '', '', '', ['生产性生产物资'], []],
	['油气资产', '', '', '', '', ['油气资产'], []],
	['无形资产', '', '', '', '', ['无形资产原值'], ['累计摊销']],
	['开发支出', '', '', '', '', ['开发支出'], []],
	['商誉', '', '', '', '', ['商誉'], []],
	['长期待摊费用', '', '', '', '', ['长期待摊费用原值'], ['累计摊销']],
	['递延所得税资产', '', '', '', '', ['递延所得税资产'], []],
	['其他非流动资产', '', '', '', '', ['其他非流动资产'], []],

	// 32
	['非流动资产合计', '', '', '', '', '', ''],

	// 33
	['资产总计', '', '', '', '', '', ''],
	]};
	response.success(structure);
});

// 根据给定公司，年月，科目（数组）计算期初数据+本期贷方发生额-本期借方发生额
AV.Cloud.define('calculateTheFinalData', function(companyId, year, month, plusSubjects, minusSubjects) {
	var structure = null;
	AV.Cloud.run('getTheBalanceSheetStructure', null, {
		success: function(data){
			structure = data;
  		},
  		error: function(err){
  		}
	});

	if (structure == null) {

	}

	// 选出所有这个月以前月份的包含这几个subjects的entry

	// 获取初期数据
	var delta = 0;

	// 遍历所有的账，从每个月的账目表中获取对应科目的数据
	// for date往前推
	if (plusSubjects.length > 0) {
		var plusQuery = new AV.Query('entry_' + companyId + '_' + year + month);
  		plusQuery.containedIn('subject', plusSubjects);
  		plusQuery.find({
  			success: function(results) {
  				delta += (results[i].get('amountCredit') - results[i].get('amountDebit'));
      		}, 
      		error: function() {
      		}
    	});
	}
	
    if (minusSubjects.length > 0) {
    	var minusQuery = new AV.Query('entry_' + companyId + '_' + year + month);
  		minusQuery.containedIn('subject', minusSubjects);
  		minusQuery.find({
  			success: function(results) {
  				delta -= (results[i].get('amountCredit') - results[i].get('amountDebit'));
      		}, 
      		error: function() {
      		}
    	}); 
    }
});