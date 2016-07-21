import React from 'react'
import ReactDom from 'react-dom'
import { filterElements, filterOptions } from './data'
import { createStore } from 'redux'
import { updateSelection } from './actions'
import filterApp from './reducers'
import Masonry from 'react-masonry-component'
import _ from 'lodash'

const store = createStore(filterApp, {
  appliedFilters: {
    items: filterElements,
    selection: {},
    filters: filterOptions
  }
})

const FilterSelect = React.createClass({
  render() {
    return (
      <select className="form__control" name={ this.props.tax } onChange={e => this.handleOnChange(e)}>
        <option value="">All Options</option>
        { this.props.options.map(opt => {
          return <option key={opt.option_name} value={opt.option_name} disabled={opt.isValid == false}> {opt.option_name} </option>
        })}
      </select>
    )
  },

  handleOnChange(e) {
    this.props.onFilterChange(this.props.tax, e.target.value)
  }
})

const FilterListItem = React.createClass({
  render() {
    return (
      <li className="grid__item one-third js-filter-item" style={{display: this.props.isFiltered ? 'none' : 'block', border:'1px solid', padding: '1rem'}} >
        <h4> { this.props.title } </h4>
        <p>{this.props.description}</p>
        { this.props.taxonomies.map((tax, i) => {
          return <small key={i}> { tax.value } </small>
        }) }
      </li>
    )
  }
})

const FilterList = React.createClass({
  render() {

    const masonryOptions = {
      percentPosition: true
    }

    return (
      <div className="container">

        <div className="grid mb-1">
          { this.props.filters.map(filter => {
            return <div className="grid__item" key={filter.taxonomy_name}>
              <FilterSelect 
                tax={ filter.taxonomy_name }
                options={ filter.options }
                onFilterChange={(tax, val) => store.dispatch(updateSelection(tax, val)) } />
            </div>
          }) }
        </div>

        <Masonry className="grid" options={masonryOptions}>
          { this.props.list.map((item) => {
            return <FilterListItem key={item.uid} title={item.name} taxonomies={item.taxonomies} isFiltered={item.isFiltered} description={item.description} />
          }) }
        </Masonry>

      </div>
    )
  }
})

const render = () => {
  const { appliedFilters } = store.getState()
  ReactDom.render(<FilterList list={appliedFilters.items} filters={appliedFilters.filters} />, document.getElementById('filters'))
}

store.subscribe(render)
render()

