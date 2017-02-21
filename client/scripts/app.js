var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', !(Boolean(this.get('like'))));
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // console.log(this);
    this.on('change', this.sort);
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    this.sort();
  },
});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),


  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function(e) {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    console.log(this); ////
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});