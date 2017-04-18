class SandwichDashboard extends React.Component {
  state = {
    sandwiches: [],
  };

  componentDidMount() {
    this.loadSandwichesFromServer();
    setInterval(this.loadSandwichesFromServer, 5000);
  }

  loadSandwichesFromServer = () => {
    client.getSandwiches((serverSandwiches) => (
        this.setState({ sandwiches: serverSandwiches })
      )
    )
  }

  handleCreateFormSubmit = (sandwiches) => {
    this.createSandwich(sandwiches);
  };

  handleEditFormSubmit = (attrs) => {
    this.updateSandwiches(attrs);
  };

  handleTrashClick = (sandwichesId) => {
    this.deleteSandwiches(sandwichesId);
  };

  createSandwich = (sandwich) => {
    const s = helpers.newSandwich(sandwich);
    this.setState({
      sandwiches: this.state.sandwiches.concat(s)
    })

    client.createSandwich(s);
  }

  updateSandwich = (sandwich) => {
    this.setState({
      sandwiches: this.state.sandwiches.map((sandwich) => {
        if (sandwich.id === attrs.id) {
          return Object.assign({}, sandwich, {
            title: attrs.title,
            project: attrs.project,
          });
        } else {
          return sandwich;
        }
      }),
    });

    client.updateTimer(attrs);
  }

  deleteSandwich = (sandwichId) => {
    this.setState({
      sandwiches: this.state.sandwiches.filter(t => t.id !== sandwichId),
    });

    client.deleteSandwich(
      { id: sandwichId }
    );
  }


  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableSandwichList 
            sandwiches={this.state.sandwiches}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
          <ToggleableSandwichForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    )
  }
}

class ToggleableSandwichForm extends React.Component {
  state = {
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  handleFormSubmit = (sandwich) => {
    this.props.onFormSubmit(sandwich);
    this.setState({ isOpen: false });
  };

  render() {
    if (this.state.isOpen) {
      return (
        <SandwichForm
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <div className="ui basic content center aligned segment">
          <button
            className='ui basic button icon'
            onClick={this.handleFormOpen}
          >
            <i className='plus icon' />
          </button>
        </div>
      )
    }
  }
}

class EditableSandwichList extends React.Component {
  render() {
    const sandwiches = this.props.sandwiches.map((sandwich) => (
      <EditableSandwich
        key={sandwich.id}
        id={sandwich.id}
        customer={sandwich.customer}
        ingredients={sandwich.ingredients}
        runningSince={sandwich.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
      />
      ));
    return(
      <div id='sandwiches'>
        {sandwiches}
      </div>
    )
  }
}

class EditableSandwich extends React.Component {
  state = {
    editFormOpen: false,
  };

  handleEditClick = () => {
    this.openForm();
  };

  handleFormClose = () => {
    this.closeForm()
  };

  handleSubmit = (sandwich) => {
    this.props.onFormSubmit(sandwich);
    this.closeForm()
  }

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <SandwichForm
          id={this.props.id}
          customer={this.props.customer}
          ingredients={this.props.ingredients}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <Sandwich
          id={this.props.id}
          customer={this.props.customer}
          ingredients={this.props.ingredients}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
        />
      );
    }
  }
}

class Sandwich extends React.Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleStartClick = () => {
    this.props.onStartClick(this.props.id);
  };

  handleStopClick = () => {
    this.props.onStopClick(this.props.id);
  };

  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };

  render() {
    const ingredients = helpers.renderIngredients(this.props.ingredients)
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='header'>
            {this.props.id}
          </div>
          <div className='meta'>
            {ingredients}
          </div>
          <div className='center aligned description'>
            <h2>
              Ready to go to cart!
            </h2>
          </div>
          <div className='extra content'>
            <span
              className='right floated edit icon'
              onClick={this.props.onEditClick}
            >
              <i className='edit icon' />
            </span>
            <span
              className='right floated trash icon'
              onClick={this.handleTrashClick}
            >
              <i className='trash icon' />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

class SandwichTransferButton extends React.Component {
  render() {
    return(<button>todo</button>)
  }
}

class SandwichForm extends React.Component {
  state = {
    customer:this.props.customer || '',
    ingredients: this.props.ingredients || '',
  };

  handleCustomerChange = (e) => {
    this.setState({ customer: e.target.value });
  };

  handleIngredientsChange = (e) => {
    this.setState({ ingredients: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      customer: this.state.customer,
      ingredients: this.state.ingredients,
    });
  };

  render() {
    const submitText = this.props.id ? 'Update' : 'Create';
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Customer</label>
              <input
                type='text'
                value={this.state.customer}
                onChange={this.handleCustomerChange}
              />
            </div>
            <div className='field'>
              <label>Ingredients</label>
              <input
                type='text'
                value={this.state.ingredients}
                onChange={this.handleIngredientsChange}
              />
            </div>
            <div className='ui two bottom attached buttons'>
              <button
                className='ui basic blue button'
                onClick={this.handleSubmit}
              >
                {submitText}
              </button>
              <button
                className='ui basic red button'
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <SandwichDashboard />,
  document.getElementById('content')
);