import { aws_budgets, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Budget } from "../lib/constructs//Budget";
interface BillingStackProps extends StackProps{
    budgetAmount: number,
    emailAddress: string
}
export class BillingStack extends Stack{
    constructor(scope: Construct, id: string, props: BillingStackProps ){
        super(scope, id, props);

        new Budget(this, 'Budget', {
            BudgetAmount: props.budgetAmount,
            emailAddress: props.emailAddress
        })
    }
}