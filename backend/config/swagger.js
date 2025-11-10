const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Government Tracker API',
      version: '1.0.0',
      description: 'API for tracking congressional bills and government activities',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://your-api-domain.com'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      schemas: {
        Bill: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Unique identifier for the bill',
              example: '118-hr-146'
            },
            congress: {
              type: 'integer',
              description: 'Congress session number',
              example: 118
            },
            type: {
              type: 'string',
              description: 'Type of bill',
              enum: ['hr', 's', 'hjres', 'sjres', 'hconres', 'sconres', 'hres', 'sres'],
              example: 'hr'
            },
            number: {
              type: 'integer',
              description: 'Bill number',
              example: 146
            },
            title: {
              type: 'string',
              description: 'Bill title',
              example: 'To provide for the establishment of a national memorial...'
            },
            shortTitle: {
              type: 'string',
              description: 'Shortened version of the title'
            },
            introducedDate: {
              type: 'string',
              format: 'date',
              description: 'Date when the bill was introduced'
            },
            latestAction: {
              $ref: '#/components/schemas/Action'
            },
            sponsors: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Member'
              }
            },
            status: {
              type: 'string',
              enum: ['active', 'pending', 'passed', 'failed'],
              description: 'Current status of the bill'
            }
          }
        },
        Action: {
          type: 'object',
          properties: {
            actionDate: {
              type: 'string',
              format: 'date',
              description: 'Date of the action'
            },
            text: {
              type: 'string',
              description: 'Description of the action taken'
            },
            actionCode: {
              type: 'string',
              description: 'Action code identifier'
            }
          }
        },
        Member: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'First name of the member'
            },
            lastName: {
              type: 'string',
              description: 'Last name of the member'
            },
            party: {
              type: 'string',
              description: 'Political party',
              enum: ['R', 'D', 'I']
            },
            state: {
              type: 'string',
              description: 'State abbreviation',
              example: 'CA'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            count: {
              type: 'integer',
              description: 'Total number of items'
            },
            hasNext: {
              type: 'boolean',
              description: 'Whether there are more pages'
            },
            next: {
              type: 'string',
              nullable: true,
              description: 'URL for next page'
            },
            offset: {
              type: 'integer',
              description: 'Current offset'
            },
            limit: {
              type: 'integer',
              description: 'Items per page'
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message'
                },
                status: {
                  type: 'integer',
                  description: 'HTTP status code'
                }
              }
            }
          }
        }
      },
      parameters: {
        offsetParam: {
          name: 'offset',
          in: 'query',
          description: 'Number of items to skip (for pagination)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 0,
            default: 0
          }
        },
        limitParam: {
          name: 'limit',
          in: 'query',
          description: 'Maximum number of items to return',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        sortParam: {
          name: 'sort',
          in: 'query',
          description: 'Sort order',
          required: false,
          schema: {
            type: 'string',
            enum: ['updateDate+desc', 'updateDate+asc', 'number+desc', 'number+asc'],
            default: 'updateDate+desc'
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = specs;