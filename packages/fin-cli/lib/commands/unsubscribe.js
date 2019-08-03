'use strict'

const { Confirm } = require('enquirer')
const { parseFaasIdentifier } = require('fin-utils')

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('unsubscribe <project>')
    .description('Unsubscribes from a project')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (identifier, opts) => {
      program.requireAuthentication()

      try {
        const parsedFaas = parseFaasIdentifier(identifier, {
          strict: true,
          namespace: client.user.username
        })

        if (!parsedFaas) {
          throw new Error(`Invalid project identifier [${identifier}]`)
        }

        const { projectId: project } = parsedFaas

        // TODO: remove this call to resolveConsumers?
        // TODO: is moving all parsing and ID formatting logic to be shared between
        // client and server really a good idea?

        const [ consumer ] = await spinner(
          client.resolveConsumers([ project ]),
          `Resolving subscription for project [${project}]`
        )

        if (!opts.yes) {
          const prompt = new Confirm({
            message: `Are you sure you want to unsubscribe from project [${consumer.project}]?`,
            initial: true
          })

          const answer = await prompt.run()
          if (!answer) {
            process.exit(1)
          }
        }

        await spinner(
          client.removeConsumer(consumer),
          `Cancelling subscription to project [${consumer.project}]`
        )

        console.log(`Successfully unsubscribed from project [${project}]`)
      } catch (err) {
        handleError(err)
      }
    })
}
