const state=window.optimizely.get('state');
const utils=window.optimizely.get('utils');
const campaignObject=state.getDecisionObject({'campaignId':campaignId});

if(campaignObject !== null){
  utils.waitUntil(() => {
    return typeof(window.gtag) === 'function';
  }).then(() => {
  	window.gtag('event', 'optimizely-decision', {
      Experiment: campaignObject.experiment,
      Variation:campaignObject.variation
    });
  });
}
