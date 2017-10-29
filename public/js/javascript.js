const baseURI = 'https://www.idbd.co.kr/lotto';

var emailRegExp = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

var app = new Vue({
  el: '#vue_app',
  data: {
    num1: 0,
    num2: 0,
    num3: 0,
    num4: 0,
    num5: 0,
    num6: 0,
    show1:0,
    show2:0,
    show3:0,
    show4:0,
    show5:0,
    show6:0,
    email:"",
    name:"",
    subject:"",
    content:"",
    loading: false
  },
  methods:{
	  lottery:function(){
		  const vm = this;
		  axios.get('/lotto')
			  .then(function (response) {
				  var dataArr = response.data.result;
				  vm.num1 = dataArr[0];
				  vm.num2= dataArr[1];
				  vm.num3 = dataArr[2];
				  vm.num4 = dataArr[3];
				  vm.num5 = dataArr[4];
				  vm.num6 = dataArr[5];
			  })
			  .catch(function (error) {
			    alert("내부 서버 오류입니다. 잠시후에 시도해 주세요!!");
			  });
	  },
	  sent_email:function(){
		  const vm = this;
		  if(!((vm.name).length>0)){
			  alert("이름을 적어주세요");
		  }else if(!emailRegExp.test(vm.email)){
			  alert("올바른 이메일을 적어주세요")
		  } else if(!((vm.subject).length>0)){
			  alert("이메일 제목을 입력해 주세요");
		  } else if(!((vm.content).length>0)){
			  alert("내용을 입력해 주세요");
		  } else{
			  vm.loading = true;
			  axios.post('/send_email' , {
				 email : vm.email,
				 name : vm.name,
				 subject : vm.subject,
				 content : vm.content
			  }).then(function(res){
				  console.log(res.data.result);
				  if(res.data.result==true){
					  alert("메일발송이 완료 되었습니다.");
					  vm.loading = false;
				  } else{
					  alert("내부 서버 오류입니다.");
					  vm.loading = false;
				  }
			  })
			  .catch(function(error){
				  alert("내부 서버 오류입니다.");
				  vm.loading = false;
			  });
		  }
	  }
  },
  watch:{
	  num1:function(newValue, oldValue) {
	      var vm = this
	      function animate () {
	        if (TWEEN.update()) {
	          requestAnimationFrame(animate)
	        }
	      }
	      new TWEEN.Tween({ tweeningNumber: oldValue })
	        .easing(TWEEN.Easing.Quadratic.Out)
	        .to({ tweeningNumber: newValue }, 5000)
	        .onUpdate(function () {
	          vm.show1 = this.tweeningNumber.toFixed(0)
	        })
	        .start()
	      animate()
	    },
	  num2:function(newValue, oldValue) {
	      var vm = this
	      function animate () {
	        if (TWEEN.update()) {
	          requestAnimationFrame(animate)
	        }
	      }
	      new TWEEN.Tween({ tweeningNumber: oldValue })
	        .easing(TWEEN.Easing.Quadratic.Out)
	        .to({ tweeningNumber: newValue }, 5000)
	        .onUpdate(function () {
	          vm.show2 = this.tweeningNumber.toFixed(0)
	        })
	        .start()
	      animate()
	    },
	      num3:function(newValue, oldValue) {
		      var vm = this
		      function animate () {
		        if (TWEEN.update()) {
		          requestAnimationFrame(animate)
		        }
		      }
		      new TWEEN.Tween({ tweeningNumber: oldValue })
		        .easing(TWEEN.Easing.Quadratic.Out)
		        .to({ tweeningNumber: newValue }, 5000)
		        .onUpdate(function () {
		          vm.show3 = this.tweeningNumber.toFixed(0)
		        })
		        .start()
		      animate()
		    },
      num4:function(newValue, oldValue) {
	      var vm = this
	      function animate () {
	        if (TWEEN.update()) {
	          requestAnimationFrame(animate)
	        }
	      }
	      new TWEEN.Tween({ tweeningNumber: oldValue })
	        .easing(TWEEN.Easing.Quadratic.Out)
	        .to({ tweeningNumber: newValue }, 5000)
	        .onUpdate(function () {
	          vm.show4 = this.tweeningNumber.toFixed(0)
	        })
	        .start()
	      animate()
	    },
	      num5:function(newValue, oldValue) {
		      var vm = this
		      function animate () {
		        if (TWEEN.update()) {
		          requestAnimationFrame(animate)
		        }
		      }
		      new TWEEN.Tween({ tweeningNumber: oldValue })
		        .easing(TWEEN.Easing.Quadratic.Out)
		        .to({ tweeningNumber: newValue }, 5000)
		        .onUpdate(function () {
		          vm.show5 = this.tweeningNumber.toFixed(0)
		        })
		        .start()
		      animate()
		    },
		    num6:function(newValue, oldValue) {
			      var vm = this
			      function animate () {
			        if (TWEEN.update()) {
			          requestAnimationFrame(animate)
			        }
			      }
			      new TWEEN.Tween({ tweeningNumber: oldValue })
			        .easing(TWEEN.Easing.Quadratic.Out)
			        .to({ tweeningNumber: newValue }, 5000)
			        .onUpdate(function () {
			          vm.show6 = this.tweeningNumber.toFixed(0)
			        })
			        .start()
			      animate()
			    }
  }
  
});
