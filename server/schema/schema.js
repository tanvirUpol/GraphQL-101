// mongoose models
const Project = require('../models/Project')
const Client = require('../models/Client')


const { GraphQLSchema, 
        GraphQLID, 
        GraphQLObjectType, 
        GraphQLString,
        GraphQLList,
        GraphQLNonNull,
        GraphQLEnumType
         } = require('graphql')      

// Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        clientId: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent,args) {
                // return clients.find(client => client.id === parent.clientId)
                return Client.findById(parent.clientId)
            }
        }
    })
})

// Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve() {
                // return projects
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                // return projects.find(project => project.id === args.id)
                return Project.findById(args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve() {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                // return clients.find(client => client.id === args.id)
                return Client.findById(args.id)
            }
        }
    }
})

// mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add Client
        addClient: {
            type: ClientType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })

                return client.save()
            }, 
        },
        // Delete a client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id)
            }
        },
        // update the client
        updateClient: {
            type: ClientType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Client.findByIdAndUpdate(args.id, args, {new: true})
            }
        },
        // Add Project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                            name: 'ProjectStatus',
                            values: {
                                    'new': { value: 'Not Started' },
                                    'progress': { value: 'In Progress' },
                                    'completed': { value: 'Completed' }
                                    }
                        }),
                        defaultValue: 'Not Started',
                },
                clientId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })  
                return project.save()
            }
        },
        // delete project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id)
            }
        },
        // update project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                            name: 'ProjectStatusUpdate',
                            values: {
                                    'new': { value: 'Not Started' },
                                    'progress': { value: 'In Progress' },
                                    'completed': { value: 'Completed' }
                                    }
                        }),  
                },
                clientId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                     $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                        clientId: args.clientId
                     },
                    },
                    { new: true}
                    );
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})