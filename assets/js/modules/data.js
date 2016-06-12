export const filterElements = [
  {
    'name' : 'Person 1',
    'uid' : 1,
    'description' : 'Lorem Ipsum Dolot',
    'taxonomies': [
      {
        'taxonomy_name': 'type',
         'value' : 'board',
      },
      {
        'taxonomy_name' : 'location',
        'value' : 'new-york',
      },
      {
        'taxonomy_name' : 'department',
        'value' : 'human-resources',
      }
    ]
  },
  {
    'name' : 'Person 2',
    'uid' : 2,
    'taxonomies': [
      {
        'taxonomy_name': 'type',
         'value' : 'board',
      },
      {
        'taxonomy_name' : 'location',
        'value' : 'los-angeles',
      },
      {
        'taxonomy_name' : 'department',
        'value' : 'finance',
      }
    ]
  },
  {
    'name' : 'Person 3',
    'uid' : 3,
    'taxonomies': [
      {
        'taxonomy_name': 'type',
         'value' : 'staff',
      },
      {
        'taxonomy_name' : 'location' ,
        'value' : 'chicago',
      },
      {
        'taxonomy_name' : 'department',
        'value' : 'human-resources',
      }
    ]
  },
  {
    'name' : 'Person 4',
    'uid' : 4,
    'taxonomies': [
      {
        'taxonomy_name': 'type',
         'value' : 'staff',
      },
      {
        'taxonomy_name' : 'location' ,
        'value' : 'san-francisco',
      },
      {
        'taxonomy_name' : 'department',
        'value' : 'finance',
      }
    ]
  },
  {
    'name' : 'Person 5',
    'uid' : 5,
    'taxonomies': [
      {
        'taxonomy_name': 'type',
         'value' : 'staff',
      },
      {
        'taxonomy_name' : 'location' ,
        'value' : 'new-york',
      },
      {
        'taxonomy_name' : 'department',
        'value' : 'human-resources',
      }
    ]
  },
  {
    'name' : 'Person 6',
    'uid' : 6,
    'taxonomies': [
      {
        'taxonomy_name' : 'type',
        'value' : 'board'
      },
      {
        'taxonomy_name' : 'location',
        'value' : 'new-york'
      },
      {
        'taxonomy_name' : 'department',
        'value' : 'accounting'
      }
    ]
  },
  {
    'name' : 'Person 7',
    'uid' : 7,
    'taxonomies': [
      {
        'taxonomy_name' : 'type',
        'value' : 'staff'
      },
      {
        'taxonomy_name' : 'location',
        'value' : 'san-francisco'
      },
      {
        'taxonomy_name' : 'department',
        'value' : 'marketing'
      }
    ]
  },
]

export const filterOptions = [
  {
    taxonomy_name: 'location',
    options: [
      { 'option_name': 'new-york' }, 
      { 'option_name': 'chicago' }, 
      { 'option_name': 'los-angeles' }, 
      { 'option_name': 'san-francisco' }
    ]
  },
  {
    taxonomy_name: 'department',
    options: [
      { 'option_name': 'human-resources' }, 
      { 'option_name': 'finance' }, 
      { 'option_name': 'accounting' }, 
      { 'option_name': 'marketing' }
    ]
  }
]
