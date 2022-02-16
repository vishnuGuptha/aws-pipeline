import { aws_budgets as budgets } from 'aws-cdk-lib';
import { Construct } from 'constructs';


interface BudgetProps{
    BudgetAmount: number,
    emailAddress: string,
}
// declare const costFilters: any;
// declare const plannedBudgetLimits: any;
export class Budget extends Construct {
    constructor(scope: Construct, id: string, props: BudgetProps) {
      super(scope, id)
        
        const cfnBudget = new budgets.CfnBudget(this, 'MyCfnBudget', {
        budget: {
            budgetType: 'COST',
            timeUnit: 'MONTHLY',

            // the properties below are optional
            budgetLimit: {
            amount: props.BudgetAmount,
            unit: 'USD',
            },
        //     budgetName: 'Budget',
        //     costFilters: costFilters,
        //     costTypes: {
        //     includeCredit: false,
        //     includeDiscount: false,
        //     includeOtherSubscription: false,
        //     includeRecurring: false,
        //     includeRefund: false,
        //     includeSubscription: false,
        //     includeSupport: false,
        //     includeTax: false,
        //     includeUpfront: false,
        //     useAmortized: false,
        //     useBlended: false,
        //     },
        //     plannedBudgetLimits: plannedBudgetLimits,
        //     timePeriod: {
        //     end: 'end',
        //     start: 'start',
        //     },
        },

        // the properties below are optional
        notificationsWithSubscribers: [{
            notification: {
            comparisonOperator: 'GREATER_THAN',
            notificationType: 'ACTUAL',
            threshold: 3,

            // the properties below are optional
            thresholdType: 'PERCENTAGE',
            },
            subscribers: [{
            address: props.emailAddress,
            subscriptionType: 'EMAIL',
            }],
        }],
        });
    }
}