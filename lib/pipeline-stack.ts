import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { CloudFormationCreateUpdateStackAction, CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
    const sourceOutput = new codepipeline.Artifact('SourceOutput');
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'Pipeline_Source',
      owner: 'vishnuGuptha',
      repo: 'aws-pipeline',
      oauthToken: SecretValue.secretsManager('pipeline-token'),
      output: sourceOutput,
      branch: 'main',
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
    const buildAction = new CodeBuildAction({
      actionName: "CDL_BUILD",
      input: sourceOutput,
      outputs: [cdkBuildOutput],
      project: new PipelineProject(this, 'CdkBuildProject', {
        environment: {
          buildImage: LinuxBuildImage.STANDARD_5_0
        },
        buildSpec: BuildSpec.fromSourceFilename('build-specs/cdk-build-specs.yml')
      })
    })
    pipeline.addStage({
      stageName: 'Pipeline_Build',
      actions:[buildAction],
    });


    const UpdateAction = new CloudFormationCreateUpdateStackAction({
      actionName: "Update_Pipeline",
      stackName: "PipelineStack",
      adminPermissions: true,
      templatePath: cdkBuildOutput.atPath('../cdk.out/PipelineStack.template.json'),
    })

    pipeline.addStage({
      stageName: "Update_Pipeline",
      actions: [UpdateAction],
    });
  }
}
