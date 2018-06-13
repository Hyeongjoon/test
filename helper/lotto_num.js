var lotto_num = [
		[2,3,4,7,8,10,11,12,15,16,17,18,19,21,23,26,28,29,32,33,34,41,42,43,45],
		[5,6,7,8,11,12,13,14,15,17,19,22,24,25,27,29,31,33,34,35,36,37,38,39,40,41,44,45],
		[4,7,8,10,11,13,14,16,19,20,22,23,24,27,29,30,31,32,33,34,36,37,38,39,41,42,44],
		[5,8,9,10,13,18,19,20,25,26,27,33,34,37,39,40,41,44,45],
		[6,9,13,14,16,21,22,23,25,26,27,29,30,31,32,34,36,37,39,42,43,44,45],
		[7,8,9,10,12,13,15,16,17,18,19,21,24,28,30,31,34,37,38,40,41,43,44,45],
		[8,9,10,15,16,17,18,19,20,21,22,24,26,33,34,37,38,39,40,41,43,44],
		[10,13,17,18,19,21,23,25,26,27,28,30,34,35,37,38,39,40,43,45],
		[10,12,13,14,16,17,19,22,27,28,29,31,33,34,35,37,38,39,40,41,42,43],
		[11,14,15,16,18,20,21,22,23,24,29,34,36,38,41,42,43,44],
		[12,13,14,16,17,18,21,22,23,24,25,26,29,33,35,36,37,39,40,43,44,45]
]



exports.getLottoNum = function(){
	var lotto_set = new Set();
	var index = Math.floor(Math.random()*11);
	lotto_set.add(index+1);
	var length = lotto_num[index].length;
	var count=2;
	while(lotto_set.size!=6){
		var num = lotto_num[index][Math.floor(Math.random()*length)];
		switch(count){
			case 2: {
				if(num<=20){
					lotto_set.add(num);
				}
				break;
			}
			case 3: {
				if(num>=11 && num <=30){
					lotto_set.add(num);
				}
				break;
			}
			case 4: {
				if(num>=11 && num <=40){
					lotto_set.add(num);
				}
				break;
			}
			case 5: {
				if(num>=21 && num <=40){
					lotto_set.add(num);
				}
				break;
			}
			case 6: {
				if(num>=31 && num <=46){
					lotto_set.add(num);
				}
				break;
			}
		}
		if(lotto_set.size==count){
			++count;
		}
	}
	var myArr = Array.from(lotto_set);
	myArr.sort(function(a, b) {
		  return a - b;
		});
	return myArr;
};