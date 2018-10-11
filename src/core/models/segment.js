class ZmSegment extends ZmModel {
	
	constructor(key = null, data = null) {
		
		super(key, data, {
			name: null,
			content: {
				childs: []
			}
		});
		
		this.setJoins([{
			model: 'project',
			relation: this.joinRelation.single,
			type: this.joinType.parent
		}]);
		
		if(data) {
			Object.assign(this, data);
		}
		
		return this;
	}
	
	isValid() {
		return this.data.name;
	}
	
	getContent() {
		return this.data.content;
	}
	
	setContent(content) {
		this.data.content = content;
		return this;
	}
	
	cleanContent() {
		this.data.content = angular.fromJson(angular.toJson(this.data.content));
	}
};